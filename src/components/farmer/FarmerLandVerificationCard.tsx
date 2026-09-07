import React, { useState, useEffect } from 'react';
import {
  FileCheck,
  ShieldCheck,
  Clock,
  AlertTriangle,
  XCircle,
  CheckCircle2,
  Edit3,
  Send,
  Building2,
  MapPin,
  FileText,
  User,
  Info,
} from 'lucide-react';
import { FarmerProfile } from '../../types/farmer';
import { FarmerLandRecord, LandVerificationInput, LandVerificationStatus } from '../../types/landVerification';
import { fetchFarmerLandVerification, submitFarmerLandVerification } from '../../services/landVerificationApiService';
import { LanguageCode } from '../../types';

interface FarmerLandVerificationCardProps {
  profile: FarmerProfile;
  currentLanguage: LanguageCode;
}

export const FarmerLandVerificationCard: React.FC<FarmerLandVerificationCardProps> = ({
  profile,
  currentLanguage,
}) => {
  const isHi = currentLanguage === 'hi';

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [record, setRecord] = useState<FarmerLandRecord | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 10 Form Fields required by specification
  const [farmerName, setFarmerName] = useState(profile.name || '');
  const [fatherName, setFatherName] = useState('');
  const [district, setDistrict] = useState(profile.district || 'Bareilly');
  const [tehsil, setTehsil] = useState(profile.tehsil || 'Baheri');
  const [village, setVillage] = useState(profile.village || 'Haridaspur');
  const [khataNumber, setKhataNumber] = useState('');
  const [khasraNumber, setKhasraNumber] = useState('');
  const [landArea, setLandArea] = useState<string>(String(profile.totalLandAcres || profile.landAreaAcres || '12.5'));
  const [landUnit, setLandUnit] = useState<'Acres' | 'Bigha' | 'Hectare'>('Acres');
  const [ownerNameInKhatauni, setOwnerNameInKhatauni] = useState(profile.name || '');

  // Fetch current verification record
  const loadRecord = async () => {
    setLoading(true);
    try {
      const data = await fetchFarmerLandVerification(profile.farmerId || profile.phone);
      if (data) {
        setRecord(data);
        setFarmerName(data.farmerName);
        setFatherName(data.fatherName);
        setDistrict(data.district);
        setTehsil(data.tehsil);
        setVillage(data.village);
        setKhataNumber(data.khataNumber);
        setKhasraNumber(data.khasraNumber);
        setLandArea(String(data.landArea));
        setLandUnit(data.landUnit);
        setOwnerNameInKhatauni(data.ownerNameInKhatauni);
        setIsEditing(data.status === 'Needs Correction');
      } else {
        // Defaults for first submission
        setIsEditing(true);
      }
    } catch (err) {
      console.error('Failed to load land verification record:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecord();
  }, [profile.farmerId, profile.phone]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (
      !farmerName.trim() ||
      !fatherName.trim() ||
      !district.trim() ||
      !tehsil.trim() ||
      !village.trim() ||
      !khataNumber.trim() ||
      !khasraNumber.trim() ||
      !ownerNameInKhatauni.trim()
    ) {
      setFeedback({
        type: 'error',
        message: isHi
          ? 'कृपया सभी आवश्यक फ़ील्ड (किसान नाम, पिता का नाम, ज़िला, तहसील, ग्राम, खाता संख्या, खसरा संख्या) भरें।'
          : 'Please complete all required fields.',
      });
      return;
    }

    setSubmitting(true);
    try {
      const payload: LandVerificationInput = {
        farmerId: profile.farmerId,
        farmerMobile: profile.phone,
        farmerName: farmerName.trim(),
        fatherName: fatherName.trim(),
        district: district.trim(),
        tehsil: tehsil.trim(),
        village: village.trim(),
        khataNumber: khataNumber.trim(),
        khasraNumber: khasraNumber.trim(),
        landArea: parseFloat(landArea) || 1.0,
        landUnit,
        ownerNameInKhatauni: ownerNameInKhatauni.trim(),
      };

      const res = await submitFarmerLandVerification(payload);
      if (res.success && res.record) {
        setRecord(res.record);
        setIsEditing(false);
        setFeedback({
          type: 'success',
          message: isHi
            ? 'भूमि सत्यापन विवरण सफलतापूर्वक जमा किया गया! सत्यापन प्रक्रिया में है।'
            : 'Land verification submitted successfully. Status is Pending Admin review.',
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.message || 'सत्यापन विवरण जमा करने में विफलता।',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err?.message || 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status: LandVerificationStatus) => {
    switch (status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{isHi ? 'राजस्व दल द्वारा सत्यापित (Verified)' : 'Verified by Land Cell'}</span>
          </span>
        );
      case 'Needs Correction':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>{isHi ? 'सुधार आवश्यक (Needs Correction)' : 'Needs Correction'}</span>
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-2xs">
            <XCircle className="w-4 h-4 text-rose-600" />
            <span>{isHi ? 'अस्वीकृत (Rejected)' : 'Rejected'}</span>
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-900 border border-blue-300 shadow-2xs">
            <Clock className="w-4 h-4 text-blue-600" />
            <span>{isHi ? 'सत्यापन प्रक्रिया में (Pending Review)' : 'Pending Review'}</span>
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-[#EEF3E8] shadow-xs text-center py-10">
        <div className="w-8 h-8 border-3 border-[#245C3A] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-gray-500">{isHi ? 'भूलेख रिकॉर्ड लोड हो रहे हैं...' : 'Loading land records...'}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EEF3E8] shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EEF3E8]">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#245C3A] to-[#1B432A] text-white flex items-center justify-center shadow-sm shrink-0">
            <FileCheck className="w-6 h-6 text-emerald-300" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg sm:text-xl font-bold font-serif text-[#26332B]">
                {isHi ? 'यूपी भूलेख / खतौनी भूमि सत्यापन' : 'UP Bhulekh / Khatauni Land Verification'}
              </h3>
              {record && getStatusBadge(record.status)}
            </div>
            <p className="text-xs text-[#68736B] mt-0.5">
              {isHi
                ? 'राजस्व अभिलेखों के आधार पर किसान भूमि स्वामित्व सत्यापन (केवल किसान हेतु)'
                : 'Revenue land ownership verification based on Khatauni records (Farmer-only)'}
            </p>
          </div>
        </div>

        {record && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-gray-100 hover:bg-[#EEF3E8] text-xs font-bold text-[#245C3A] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isHi ? 'विवरण संशोधित करें' : 'Edit Details'}</span>
          </button>
        )}
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center gap-2.5 animate-fadeIn ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          <span>{feedback.type === 'success' ? '✓' : '⚠️'}</span>
          <p>{feedback.message}</p>
        </div>
      )}

      {/* Status Highlights & Admin Notes Banner */}
      {record && (
        <div className="space-y-3">
          {record.status === 'Verified' && (
            <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-950 space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-emerald-900">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {isHi
                    ? 'भूमि रिकॉर्ड किसानसेतु राजस्व सत्यापन दल द्वारा सफलतापूर्वक सत्यापित किया गया है।'
                    : 'Land records verified by KisanSetu Land Revenue Cell.'}
                </span>
              </div>
              <p className="text-emerald-800 text-[11px] pl-6">
                समीक्षक: <strong>{record.reviewedBy || 'KisanSetu Revenue Desk'}</strong>
                {record.reviewedAt && ` • ${new Date(record.reviewedAt).toLocaleDateString('hi-IN')}`}
              </p>
              {record.adminNotes && (
                <div className="mt-2 ml-6 p-2.5 bg-white/80 rounded-xl border border-emerald-200 text-emerald-900 font-medium">
                  <strong>सत्यापन टिप्पणी (Verification Note):</strong> {record.adminNotes}
                </div>
              )}
            </div>
          )}

          {record.status === 'Needs Correction' && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  {isHi
                    ? 'समीक्षक द्वारा सुधार हेतु टिप्पणी (Action Required / Needs Correction):'
                    : 'Changes requested by verification officer:'}
                </span>
              </div>
              {record.adminNotes ? (
                <div className="p-3 bg-white rounded-xl border border-amber-200 text-amber-950 font-medium text-xs">
                  {record.adminNotes}
                </div>
              ) : (
                <p className="text-amber-800 text-xs">
                  कृपया अपनी खतौनी प्रति के अनुसार खाता व खसरा संख्या दोबारा जांच कर पुनः सबमिट करें।
                </p>
              )}
              <p className="text-[11px] text-amber-800 italic">
                कृपया नीचे दिए गए फॉर्म में आवश्यक सुधार करें और <strong>"विवरण पुनः सबमिट करें"</strong> पर क्लिक करें।
              </p>
            </div>
          )}

          {record.status === 'Rejected' && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-xs text-rose-950 space-y-2">
              <div className="flex items-center gap-2 font-bold text-rose-900">
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  {isHi ? 'भूमि सत्यापन अस्वीकृत किया गया (Verification Rejected):' : 'Verification Rejected:'}
                </span>
              </div>
              {record.adminNotes && (
                <div className="p-3 bg-white rounded-xl border border-rose-200 text-rose-950 font-medium text-xs">
                  {record.adminNotes}
                </div>
              )}
            </div>
          )}

          {record.status === 'Pending' && (
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs text-blue-950 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="font-bold text-blue-900">
                  {isHi
                    ? 'आपका भूमि सत्यापन आवेदन राजस्व जांच डेस्क के पास विचाराधीन है।'
                    : 'Your land verification is queued for manual inspection by the verification cell.'}
                </p>
                <p className="text-blue-800 text-[11px] mt-0.5">
                  प्रस्तुति तिथि (Submitted At): {new Date(record.submittedAt).toLocaleString('hi-IN')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Notice on Real UP Bhulekh Constraint & Official Portal Link */}
      <div className="p-3.5 bg-[#FAF7F0] border border-[#E3DCB] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#535D56]">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#245C3A] shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-[#26332B]">
              {isHi ? 'राजस्व सत्यापन नीति एवं आधिकारिक पोर्टल:' : 'Revenue Record Verification Policy & Official Portal:'}
            </p>
            <p className="text-[11px] text-[#68736B] mt-0.5 leading-relaxed">
              {isHi
                ? 'किसानसेतु वास्तविक सरकारी राजस्व रिकॉर्ड का सम्मान करता है। कोई कृत्रिम रिकॉर्ड नहीं बनाए जाते हैं। किसान अपनी खतौनी उत्तर प्रदेश सरकार के आधिकारिक भूलेख पोर्टल से सत्यापित कर सकते हैं।'
                : 'KisanSetu respects official government revenue records. You can verify your real land Khatauni extract directly on the official UP Government Bhulekh portal.'}
            </p>
          </div>
        </div>

        <a
          href="https://upbhulekh.gov.in/#/selection"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 px-3.5 py-2 rounded-xl bg-[#245C3A] text-white hover:bg-[#1B432B] font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-xs"
        >
          <span>{isHi ? 'आधिकारिक यूपी भूलेख पोर्टल' : 'Official UP Bhulekh Portal'}</span>
          <span className="text-[11px]">↗</span>
        </a>
      </div>

      {/* Display Card (Read-Only Mode when not editing and record exists) */}
      {record && !isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EBE5D8] space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {isHi ? 'किसान का नाम' : 'Farmer Name'}
            </span>
            <p className="font-bold text-[#26332B] text-sm">{record.farmerName}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EBE5D8] space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {isHi ? 'पिता का नाम' : "Father's Name"}
            </span>
            <p className="font-bold text-[#26332B] text-sm">{record.fatherName}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EBE5D8] space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {isHi ? 'खतौनी में दर्ज नाम' : 'Owner Name in Khatauni'}
            </span>
            <p className="font-bold text-[#245C3A] text-sm">{record.ownerNameInKhatauni}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EBE5D8] space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {isHi ? 'खाता संख्या (Khata No.)' : 'Khata Number'}
            </span>
            <p className="font-bold font-mono text-[#26332B] text-sm">{record.khataNumber}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EBE5D8] space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {isHi ? 'खसरा संख्या (Khasra No.)' : 'Khasra Number'}
            </span>
            <p className="font-bold font-mono text-[#26332B] text-sm">{record.khasraNumber}</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EBE5D8] space-y-1">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {isHi ? 'कुल रकबा (Land Area)' : 'Land Area'}
            </span>
            <p className="font-bold text-[#26332B] text-sm">
              {record.landArea} {record.landUnit}
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#FBFAF4] border border-[#EBE5D8] space-y-1 sm:col-span-2 lg:col-span-3">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
              {isHi ? 'ग्राम, तहसील एवं ज़िला' : 'Village, Tehsil & District'}
            </span>
            <p className="font-bold text-[#26332B] text-sm">
              ग्राम: {record.village} • तहसील: {record.tehsil} • ज़िला: {record.district}
            </p>
          </div>
        </div>
      ) : (
        /* Form for Submission / Editing (All 10 required fields) */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. Farmer Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                1. {isHi ? 'किसान का नाम (Farmer Name) *' : 'Farmer Name *'}
              </label>
              <input
                type="text"
                value={farmerName}
                onChange={(e) => setFarmerName(e.target.value)}
                placeholder="उदा. राजेश कुमार"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            {/* 2. Father's Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                2. {isHi ? "पिता का नाम (Father's Name) *" : "Father's Name *"}
              </label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                placeholder="उदा. श्री राम सेवक वर्मा"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            {/* 3. District */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                3. {isHi ? 'ज़िला (District) *' : 'District *'}
              </label>
              <input
                type="text"
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="उदा. बरेली"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            {/* 4. Tehsil */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                4. {isHi ? 'तहसील (Tehsil) *' : 'Tehsil *'}
              </label>
              <input
                type="text"
                value={tehsil}
                onChange={(e) => setTehsil(e.target.value)}
                placeholder="उदा. बहेड़ी"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            {/* 5. Village */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                5. {isHi ? 'ग्राम / मौजा (Village) *' : 'Village *'}
              </label>
              <input
                type="text"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="उदा. हरिदासपुर"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            {/* 6. Khata Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                6. {isHi ? 'खाता संख्या (Khata Number) *' : 'Khata Number *'}
              </label>
              <input
                type="text"
                value={khataNumber}
                onChange={(e) => setKhataNumber(e.target.value)}
                placeholder="उदा. 00142"
                className="w-full px-3.5 py-2.5 font-mono bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            {/* 7. Khasra Number */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                7. {isHi ? 'खसरा संख्या (Khasra Number) *' : 'Khasra Number *'}
              </label>
              <input
                type="text"
                value={khasraNumber}
                onChange={(e) => setKhasraNumber(e.target.value)}
                placeholder="उदा. 312/1"
                className="w-full px-3.5 py-2.5 font-mono bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                required
              />
            </div>

            {/* 8 & 9. Land Area and Land Unit */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  8. {isHi ? 'रकबा (Area) *' : 'Land Area *'}
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={landArea}
                  onChange={(e) => setLandArea(e.target.value)}
                  placeholder="12.5"
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  9. {isHi ? 'इकाई (Unit) *' : 'Land Unit *'}
                </label>
                <select
                  value={landUnit}
                  onChange={(e) => setLandUnit(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                >
                  <option value="Acres">एकड़ (Acres)</option>
                  <option value="Bigha">बीघा (Bigha)</option>
                  <option value="Hectare">हेक्टेयर (Hectare)</option>
                </select>
              </div>
            </div>

            {/* 10. Owner Name as shown in Khatauni */}
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-gray-700 mb-1">
                10. {isHi ? 'खतौनी में दर्ज खातेदार का नाम (Owner Name in Khatauni) *' : 'Owner Name in Khatauni *'}
              </label>
              <input
                type="text"
                value={ownerNameInKhatauni}
                onChange={(e) => setOwnerNameInKhatauni(e.target.value)}
                placeholder="उदा. राजेश कुमार वर्मा (जैसा खतौनी में दर्ज है)"
                className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                required
              />
              <p className="text-[11px] text-gray-500 mt-1">
                {isHi
                  ? 'यदि खतौनी में नाम भिन्न या संयुक्त है, तो कृपया खतौनी में छपा हूबहू नाम दर्ज करें।'
                  : 'Enter the exact name as registered in the official revenue Khatauni extract.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>
                {submitting
                  ? 'जमा हो रहा है...'
                  : record
                  ? isHi
                    ? 'संशोधित विवरण सत्यापन हेतु भेजें'
                    : 'Submit Updated Details for Verification'
                  : isHi
                  ? 'सत्यापन हेतु जमा करें (Submit for Verification)'
                  : 'Submit for Verification'}
              </span>
            </button>

            {record && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="py-3 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs sm:text-sm transition-colors cursor-pointer"
              >
                {isHi ? 'रद्द करें' : 'Cancel'}
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};
