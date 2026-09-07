import React, { useState } from 'react';
import {
  UserCheck,
  ShieldCheck,
  MapPin,
  Phone,
  Mail,
  Award,
  Calendar,
  Layers,
  Sprout,
  Landmark,
  FileCheck,
  CheckCircle2,
  Edit2,
  X,
  Save,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { FarmerProfile } from '../../types/farmer';
import { LanguageCode } from '../../types';
import { getFarmerTranslations } from '../../data/farmerTranslations';
import { FarmerLandVerificationCard } from './FarmerLandVerificationCard';
import { updateFarmerProfileApi } from '../../services/authApiService';

interface FarmerProfileViewProps {
  profile: FarmerProfile;
  currentLanguage: LanguageCode;
  onUpdateProfile?: (updated: FarmerProfile) => void;
}

export const FarmerProfileView: React.FC<FarmerProfileViewProps> = ({
  profile,
  currentLanguage,
  onUpdateProfile,
}) => {
  const t = getFarmerTranslations(currentLanguage);
  const pT = t.profileView;
  const isHi = currentLanguage === 'hi';

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: profile.name || '',
    mobile: profile.mobile || '',
    email: profile.email || '',
    village: profile.village || '',
    tehsil: profile.tehsil || '',
    district: profile.district || '',
    pincode: profile.pincode || '',
    address: profile.address || '',
    totalLandAcres: profile.totalLandAcres ?? profile.landAreaAcres ?? 0,
    soilType: profile.soilType || profile.landType || 'Alluvial',
    irrigationSource: profile.irrigationSource || 'Borewell / Canal',
    primaryCrops: (profile.primaryCrops || []).join(', '),
    bankName: profile.bankDetails?.bankName || '',
    accountNumber: profile.bankDetails?.accountNumber || '',
    ifscCode: profile.bankDetails?.ifscCode || '',
  });

  const handleOpenEdit = () => {
    setFormData({
      name: profile.name || '',
      mobile: profile.mobile || '',
      email: profile.email || '',
      village: profile.village || '',
      tehsil: profile.tehsil || '',
      district: profile.district || '',
      pincode: profile.pincode || '',
      address: profile.address || '',
      totalLandAcres: profile.totalLandAcres ?? profile.landAreaAcres ?? 0,
      soilType: profile.soilType || profile.landType || 'Alluvial',
      irrigationSource: profile.irrigationSource || 'Borewell / Canal',
      primaryCrops: (profile.primaryCrops || []).join(', '),
      bankName: profile.bankDetails?.bankName || '',
      accountNumber: profile.bankDetails?.accountNumber || '',
      ifscCode: profile.bankDetails?.ifscCode || '',
    });
    setSaveMessage(null);
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveMessage(null);

    try {
      const updates: Partial<FarmerProfile> = {
        name: formData.name.trim(),
        mobile: formData.mobile.trim(),
        email: formData.email.trim(),
        village: formData.village.trim(),
        tehsil: formData.tehsil.trim(),
        district: formData.district.trim(),
        pincode: formData.pincode.trim(),
        address: formData.address.trim(),
        totalLandAcres: Number(formData.totalLandAcres) || 0,
        landAreaAcres: Number(formData.totalLandAcres) || 0,
        soilType: formData.soilType.trim(),
        irrigationSource: formData.irrigationSource.trim(),
        primaryCrops: formData.primaryCrops
          .split(',')
          .map((c) => c.trim())
          .filter(Boolean),
        bankDetails: {
          bankName: formData.bankName.trim(),
          accountNumber: formData.accountNumber.trim(),
          ifscCode: formData.ifscCode.trim(),
          branchName: profile.bankDetails?.branchName,
        },
      };

      const res = await updateFarmerProfileApi(updates);
      if (res.success) {
        const merged: FarmerProfile = {
          ...profile,
          ...updates,
        };
        if (onUpdateProfile) {
          onUpdateProfile(merged);
        }
        setSaveMessage({
          type: 'success',
          text: isHi ? 'प्रोफ़ाइल सफलतापूर्वक अपडेट हो गई!' : 'Profile updated successfully!',
        });
        setTimeout(() => {
          setIsEditing(false);
          setSaveMessage(null);
        }, 1200);
      } else {
        setSaveMessage({
          type: 'error',
          text: res.message || (isHi ? 'अपडेट करने में विफल।' : 'Failed to update profile.'),
        });
      }
    } catch (err: any) {
      setSaveMessage({
        type: 'error',
        text: err?.message || (isHi ? 'सर्वर त्रुटि हुई।' : 'An unexpected error occurred.'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-300">
      {/* Top Profile Header Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EEF3E8] shadow-xs relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-br from-[#245C3A] to-[#143521] text-white text-2xl font-bold font-serif flex items-center justify-center shadow-md shrink-0">
              {profile.name
                ? profile.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .slice(0, 2)
                    .toUpperCase()
                : 'KP'}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-bold font-serif text-[#26332B]">
                  {profile.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full bg-[#5F8F45]/15 text-[#245C3A] text-xs font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#5F8F45]" />
                  <span>{t.nav.eKycVerified}</span>
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#68736B] mt-0.5">
                Farmer ID: <strong className="font-mono text-[#245C3A]">{profile.farmerId}</strong>
              </p>

              <div className="flex items-center gap-3 text-xs text-[#68736B] mt-2 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#B86F4B]" />
                  {profile.village}, {profile.district} (PIN: {profile.pincode})
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-[#245C3A]" />
                  {profile.mobile}
                </span>
                {profile.email && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-[#245C3A]" />
                      {profile.email}
                    </span>
                  </>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#5F8F45]" />
                  {pT.memberSince} {profile.memberSince}
                </span>
              </div>
            </div>
          </div>

          <button
            id="farmer-edit-profile-btn"
            onClick={handleOpenEdit}
            className="px-4 py-2.5 rounded-2xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-2 self-start sm:self-center cursor-pointer"
          >
            <Edit2 className="w-4 h-4" />
            <span>{isHi ? 'प्रोफ़ाइल संपादित करें' : 'Edit Profile'}</span>
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#EEF3E8] max-h-[90vh] overflow-y-auto space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF3E8]">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-[#EEF3E8] text-[#245C3A] flex items-center justify-center">
                  <Edit2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#26332B]">
                    {isHi ? 'किसान प्रोफ़ाइल संपादित करें' : 'Edit Farmer Profile'}
                  </h3>
                  <p className="text-xs text-[#68736B]">
                    {isHi ? 'व्यक्तिगत, खेत व बैंक विवरण अपडेट करें' : 'Update your contact, land and banking information'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {saveMessage && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 ${
                  saveMessage.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {saveMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{saveMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Basic Details */}
              <div className="space-y-3">
                <div className="font-bold text-sm text-[#26332B] border-b pb-1">
                  {isHi ? 'व्यक्तिगत जानकारी' : 'Personal Information'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'पूरा नाम' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'मोबाइल नंबर' : 'Mobile Number'} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.mobile}
                      onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'ईमेल' : 'Email'}
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'गांव / ग्राम' : 'Village'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.village}
                      onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'तहसील' : 'Tehsil'}
                    </label>
                    <input
                      type="text"
                      value={formData.tehsil}
                      onChange={(e) => setFormData({ ...formData, tehsil: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'ज़िला' : 'District'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'पिनकोड' : 'Pincode'}
                    </label>
                    <input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'पूरा पता' : 'Address'}
                    </label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Farm & Land Info */}
              <div className="space-y-3 pt-2">
                <div className="font-bold text-sm text-[#26332B] border-b pb-1">
                  {isHi ? 'खेत व भूमि विवरण' : 'Farm & Land Information'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'कुल भूमि (एकड़)' : 'Total Land (Acres)'} *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={formData.totalLandAcres}
                      onChange={(e) => setFormData({ ...formData, totalLandAcres: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'मिट्टी का प्रकार' : 'Soil Type'}
                    </label>
                    <input
                      type="text"
                      value={formData.soilType}
                      onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'सिंचाई स्रोत' : 'Irrigation Source'}
                    </label>
                    <input
                      type="text"
                      value={formData.irrigationSource}
                      onChange={(e) => setFormData({ ...formData, irrigationSource: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'प्रमुख फसलें (अल्पविराम से अलग करें)' : 'Primary Crops (comma separated)'}
                    </label>
                    <input
                      type="text"
                      value={formData.primaryCrops}
                      onChange={(e) => setFormData({ ...formData, primaryCrops: e.target.value })}
                      placeholder="गेहूं, धान, सरसों"
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Bank Details */}
              <div className="space-y-3 pt-2">
                <div className="font-bold text-sm text-[#26332B] border-b pb-1">
                  {isHi ? 'बैंक खाता विवरण (DBT Escrow)' : 'Bank Details (Direct DBT Escrow)'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'बैंक का नाम' : 'Bank Name'}
                    </label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'खाता संख्या' : 'Account Number'}
                    </label>
                    <input
                      type="text"
                      value={formData.accountNumber}
                      onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[#68736B] font-semibold mb-1">
                      {isHi ? 'IFSC कोड' : 'IFSC Code'}
                    </label>
                    <input
                      type="text"
                      value={formData.ifscCode}
                      onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
                      className="w-full px-3 py-2 rounded-xl border border-[#EEF3E8] bg-[#FBFAF4] focus:bg-white focus:border-[#245C3A] text-sm font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EEF3E8]">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 rounded-xl border border-[#EEF3E8] text-[#68736B] hover:bg-gray-100 font-bold"
                >
                  {isHi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2 rounded-xl bg-[#245C3A] text-white font-bold hover:bg-[#1B432B] flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>{isHi ? 'सुरक्षित करें' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UP Bhulekh / Khatauni Land Verification (Farmer-Only) */}
      <FarmerLandVerificationCard profile={profile} currentLanguage={currentLanguage} />

      {/* Farmer Registry Verification Card (Farmer-Only) */}
      {(profile.farmerRegistryNumber || profile.farmerRegistryDocumentUrl || profile.farmerRegistryVerificationStatus) && (
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EEF3E8] shadow-xs space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 pb-3 border-b border-[#EEF3E8]">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                <FileCheck className="w-5 h-5" />
              </span>
              <div>
                <h3 className="font-bold text-base text-[#26332B]">
                  किसान रजिस्ट्री विवरण (Farmer Registry Details)
                </h3>
                <p className="text-xs text-[#68736B]">
                  अपलोड किए गए किसान रजिस्ट्री दस्तावेज़ व OCR सत्यापन
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {profile.farmerRegistryVerificationStatus === 'MATCHED'
                    ? 'दस्तावेज़ सत्यापित (Matched)'
                    : 'समीक्षाधीन (Submitted)'}
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-[#FBFAF4] rounded-2xl border border-[#EEF3E8]">
              <span className="text-[11px] text-[#68736B] block">रजिस्ट्री संख्या (Registry ID)</span>
              <span className="font-mono font-bold text-[#245C3A] text-sm block mt-0.5">
                {profile.farmerRegistryNumber || 'दस्तावेज़ में उपलब्ध नहीं'}
              </span>
            </div>

            <div className="p-3 bg-[#FBFAF4] rounded-2xl border border-[#EEF3E8]">
              <span className="text-[11px] text-[#68736B] block">पिता / पति का नाम</span>
              <span className="font-bold text-[#26332B] text-sm block mt-0.5">
                {profile.fatherName || profile.farmerRegistryOcrData?.fatherOrIdentifierNameHindi || '—'}
              </span>
            </div>

            <div className="p-3 bg-[#FBFAF4] rounded-2xl border border-[#EEF3E8]">
              <span className="text-[11px] text-[#68736B] block">सत्यापित ज़िला / तहसील</span>
              <span className="font-bold text-[#26332B] text-sm block mt-0.5">
                {profile.district}{profile.tehsil ? `, ${profile.tehsil}` : ''}
              </span>
            </div>

            <div className="p-3 bg-[#FBFAF4] rounded-2xl border border-[#EEF3E8]">
              <span className="text-[11px] text-[#68736B] block">दस्तावेज़ स्थिति</span>
              <span className="font-bold text-emerald-800 text-sm block mt-0.5">
                {profile.farmerRegistryFileName ? `${profile.farmerRegistryFileName}` : 'डिजिटल प्रति संलग्न'}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-[#68736B] italic">
            ℹ️ दस्तावेज़ सत्यापन केवल अपलोड की गई प्रति से टेक्स्ट मिलान पर आधारित है। यह आधिकारिक सरकारी रिकॉर्ड्स की कानूनी पुष्टि नहीं करता है।
          </p>
        </div>
      )}

      {/* Grid of Profile Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Farm & Land Info */}
        <div className="bg-white rounded-3xl p-6 border border-[#EEF3E8] shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EEF3E8]">
            <div className="flex items-center gap-2">
              <Sprout className="w-5 h-5 text-[#5F8F45]" />
              <h3 className="font-bold text-base text-[#26332B]">{pT.farmLandTitle}</h3>
            </div>
            <button
              onClick={handleOpenEdit}
              className="text-xs font-bold text-[#245C3A] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isHi ? 'संपादित करें' : 'Edit'}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs text-[#68736B]">
            <div className="flex justify-between py-1 border-b border-[#FBFAF4]">
              <span>{pT.totalLandArea}:</span>
              <b className="text-[#26332B]">{profile.totalLandAcres ?? profile.landAreaAcres ?? '—'} Acres</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#FBFAF4]">
              <span>{pT.soilType}:</span>
              <b className="text-[#26332B]">{profile.soilType || profile.landType || 'Alluvial'}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#FBFAF4]">
              <span>{pT.irrigationSource}:</span>
              <b className="text-[#26332B]">{profile.irrigationSource || 'Borewell / Canal'}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#FBFAF4]">
              <span>{pT.primaryCrops}:</span>
              <b className="text-[#245C3A]">{(profile.primaryCrops || []).join(', ')}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#FBFAF4]">
              <span>{isHi ? 'आधार सत्यापन' : 'Aadhaar Status'}:</span>
              <b className="text-emerald-700 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {profile.aadhaarMasked || 'XXXX-XXXX-8492'} ({profile.eKycStatus})
              </b>
            </div>
          </div>
        </div>

        {/* Bank & Escrow Details */}
        <div className="bg-white rounded-3xl p-6 border border-[#EEF3E8] shadow-xs">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#EEF3E8]">
            <div className="flex items-center gap-2">
              <Landmark className="w-5 h-5 text-[#245C3A]" />
              <h3 className="font-bold text-base text-[#26332B]">{pT.bankDetailsTitle}</h3>
            </div>
            <button
              onClick={handleOpenEdit}
              className="text-xs font-bold text-[#245C3A] hover:underline cursor-pointer flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isHi ? 'संपादित करें' : 'Edit'}</span>
            </button>
          </div>

          <div className="space-y-3 text-xs text-[#68736B]">
            <div className="flex justify-between py-1 border-b border-[#FBFAF4]">
              <span>{pT.bankName}:</span>
              <b className="text-[#26332B]">{profile.bankDetails?.bankName || 'State Bank of India'}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#FBFAF4]">
              <span>{pT.accountNumber}:</span>
              <b className="text-[#26332B] font-mono">{profile.bankDetails?.accountNumber || '•••• •••• 9924'}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#FBFAF4]">
              <span>{pT.ifscCode}:</span>
              <b className="text-[#26332B] font-mono">{profile.bankDetails?.ifscCode || 'SBIN0001428'}</b>
            </div>
            <div className="flex justify-between py-1 border-b border-[#FBFAF4]">
              <span>{pT.payoutMode}:</span>
              <b className="text-[#5F8F45]">Direct DBT Escrow (Active)</b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
