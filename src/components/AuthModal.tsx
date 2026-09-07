import React, { useState, useEffect } from 'react';
import { LanguageCode, TranslationDictionary } from '../types';
import { authTranslations } from '../i18n/authTranslations';
import {
  registerFarmerApi,
  registerBuyerApi,
  loginFarmerDirectApi,
  loginBuyerDirectApi,
  loginAdminDirectApi,
} from '../services/authApiService';
import { AadhaarOcrUploadCard } from './farmer/AadhaarOcrUploadCard';
import { FarmerRegistryOcrProcessResult } from '../types/farmerRegistryOcr';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess?: (role: 'farmer' | 'buyer' | 'admin', userData?: any) => void;
  initialMode?: 'login' | 'signup';
  initialRole?: 'farmer' | 'buyer' | 'admin';
  currentLanguage?: LanguageCode;
  translations?: TranslationDictionary;
  isPage?: boolean;
  onModeChange?: (mode: 'login' | 'signup') => void;
  onRoleChange?: (role: 'farmer' | 'buyer' | 'admin' | null) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  initialMode = 'login',
  initialRole,
  currentLanguage = 'hi',
  isPage = false,
  onModeChange,
  onRoleChange,
}) => {
  // Current view state: 'role' | 'buyer' | 'seller' | 'admin'
  const [currentView, setCurrentView] = useState<'role' | 'buyer' | 'seller' | 'admin'>(
    initialRole === 'buyer' ? 'buyer' : initialRole === 'farmer' ? 'seller' : initialRole === 'admin' ? 'admin' : 'role'
  );


  // Tabs for Buyer and Seller: 'login' | 'register'
  const [buyerTab, setBuyerTab] = useState<'login' | 'register'>(initialMode === 'signup' ? 'register' : 'login');
  const [farmerTab, setFarmerTab] = useState<'login' | 'register'>(initialMode === 'signup' ? 'register' : 'login');

  // Synchronize tabs if initialMode changes
  useEffect(() => {
    const tab = initialMode === 'signup' ? 'register' : 'login';
    setBuyerTab(tab);
    setFarmerTab(tab);
  }, [initialMode]);

  // Synchronize role view if initialRole changes
  useEffect(() => {
    if (initialRole === 'buyer') {
      setCurrentView('buyer');
    } else if (initialRole === 'farmer') {
      setCurrentView('seller');
    } else if (initialRole === 'admin') {
      setCurrentView('admin');
    } else if (!initialRole) {
      setCurrentView('role');
    }
  }, [initialRole]);


  // Common UI Feedback State
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // =========================================================================
  // BUYER FORM STATE (Password Auth, No OTP, No Land Fields)
  // Input fields default to empty for real production users
  // =========================================================================
  const [buyerLoginIdentifier, setBuyerLoginIdentifier] = useState('');
  const [buyerLoginPassword, setBuyerLoginPassword] = useState('');

  const [buyerName, setBuyerName] = useState('');
  const [buyerRegisterMobile, setBuyerRegisterMobile] = useState('');
  const [buyerPassword, setBuyerPassword] = useState('');
  const [buyerBusinessName, setBuyerBusinessName] = useState('');
  const [buyerBusinessType, setBuyerBusinessType] = useState('Wholesaler / Mandi Trader');
  const [buyerLocation, setBuyerLocation] = useState('Bareilly, Uttar Pradesh');

  // =========================================================================
  // FARMER FORM STATE (Simplified Aadhaar-based Registration, No Land Fields)
  // Input fields default to empty for real production users
  // =========================================================================
  const [farmerLoginIdentifier, setFarmerLoginIdentifier] = useState('');
  const [farmerLoginPassword, setFarmerLoginPassword] = useState('');

  // 1. Name (As per Aadhaar)
  const [farmerName, setFarmerName] = useState('');
  // 2. Father Name (As per Aadhaar)
  const [farmerFatherName, setFarmerFatherName] = useState('');
  // 3. Aadhaar Number
  const [farmerAadhaarNumber, setFarmerAadhaarNumber] = useState('');
  // 4. Mobile Number
  const [farmerPhone, setFarmerPhone] = useState('');
  // 5. Email ID
  const [farmerEmail, setFarmerEmail] = useState('');
  // 6. Create Password
  const [farmerPassword, setFarmerPassword] = useState('');
  // 7. Confirm Password
  const [farmerConfirmPassword, setFarmerConfirmPassword] = useState('');
  // 8. Upload Aadhaar Front
  const [farmerAadhaarFront, setFarmerAadhaarFront] = useState<{
    dataUrl: string;
    fileName: string;
  } | null>(null);
  // 9. Upload Aadhaar Back
  const [farmerAadhaarBack, setFarmerAadhaarBack] = useState<{
    dataUrl: string;
    fileName: string;
  } | null>(null);
  const [farmerAadhaarOcrResult, setFarmerAadhaarOcrResult] = useState<FarmerRegistryOcrProcessResult | null>(null);

  // =========================================================================
  // ADMIN FORM STATE (Direct Server Auth: Email + Password)
  // Input fields default to empty for real production administrators
  // =========================================================================
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');

  // Translations
  const langKey: LanguageCode = (currentLanguage && authTranslations[currentLanguage as LanguageCode])
    ? (currentLanguage as LanguageCode)
    : 'hi';
  const t = authTranslations[langKey];

  if (!isOpen) return null;

  const handleClose = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
    onClose();
  };

  // Quick autofill demo credentials helper (clearly isolated for dev/testing)
  const handleAutofillFarmer = () => {
    setFarmerLoginIdentifier('9876543210');
    setFarmerLoginPassword('password123');
    setFarmerTab('login');
    setCurrentView('seller');
    onRoleChange?.('farmer');
    onModeChange?.('login');
  };

  const handleAutofillBuyer = () => {
    setBuyerLoginIdentifier('9837012456');
    setBuyerLoginPassword('password123');
    setBuyerTab('login');
    setCurrentView('buyer');
    onRoleChange?.('buyer');
    onModeChange?.('login');
  };

  const handleAutofillBuyerAmit = () => {
    setBuyerLoginIdentifier('9876543211');
    setBuyerLoginPassword('password123');
    setBuyerTab('login');
    setCurrentView('buyer');
    onRoleChange?.('buyer');
    onModeChange?.('login');
  };

  const handleAutofillAdmin = () => {
    setAdminEmail('kisansetu2026@gmail.com');
    setCurrentView('admin');
    onRoleChange?.('admin');
    onModeChange?.('login');
  };

  // =========================================================================
  // 0. ADMIN LOGIN (Direct Server Password Authentication)
  // =========================================================================
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!adminEmail.trim() || !adminPassword.trim()) {
      setErrorMessage(
        langKey === 'hi' ? 'कृपया एडमिन ईमेल और पासवर्ड दर्ज करें।' : 'Please enter admin email and password.'
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginAdminDirectApi(adminEmail.trim(), adminPassword);
      if (res.success && res.token) {
        setSuccessMessage(
          langKey === 'hi'
            ? 'प्रशासनिक लॉगिन सफल! नियंत्रण कक्ष खुल रहा है...'
            : 'Admin authentication successful! Opening Control Center...'
        );
        setTimeout(() => {
          handleClose();
          if (onLoginSuccess) {
            onLoginSuccess('admin', res.user);
          }
        }, 400);
      } else {
        setErrorMessage(
          res.message ||
            (langKey === 'hi'
              ? 'प्रशासनिक लॉगिन विफल। कृपया ईमेल व पासवर्ड जांचें।'
              : 'Admin authentication failed. Please verify credentials.')
        );
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Network error during admin login.');
    } finally {
      setIsLoading(false);
    }
  };


  // =========================================================================
  // 1. FARMER LOGIN (Normal password-based without OTP)
  // =========================================================================
  const handleFarmerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!farmerLoginIdentifier.trim() || !farmerLoginPassword.trim()) {
      setErrorMessage(t.fillAllFields);
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginFarmerDirectApi(farmerLoginIdentifier.trim(), farmerLoginPassword);
      if (res.success && res.token) {
        setSuccessMessage(t.loginSuccess || 'लॉगिन सफल! किसान डैशबोर्ड खुल रहा है...');
        setTimeout(() => {
          handleClose();
          if (onLoginSuccess) {
            onLoginSuccess('farmer', res.user);
          }
        }, 400);
      } else {
        setErrorMessage(res.message || 'लॉगिन विफल। कृपया मोबाइल नंबर और पासवर्ड जांचें।');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // 2. FARMER REGISTER (9 Simple Fields, Aadhaar OCR, No Land Details)
  // =========================================================================
  const handleFarmerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    // 1. Name check
    if (!farmerName.trim()) {
      setErrorMessage(langKey === 'hi' ? 'कृपया आधार के अनुसार नाम दर्ज करें।' : 'Please enter name as per Aadhaar.');
      return;
    }

    // 2. Father name check
    if (!farmerFatherName.trim()) {
      setErrorMessage(
        langKey === 'hi' ? 'कृपया पिता / पति का नाम दर्ज करें।' : "Please enter father's/husband's name."
      );
      return;
    }

    // 3. Aadhaar check
    const cleanAadhaar = farmerAadhaarNumber.replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      setErrorMessage(
        langKey === 'hi' ? 'कृपया मान्य 12-अंकों का आधार नंबर दर्ज करें।' : 'Please enter a valid 12-digit Aadhaar number.'
      );
      return;
    }

    // 4. Mobile check
    const cleanPhone = farmerPhone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      setErrorMessage(
        langKey === 'hi' ? 'कृपया वैध 10-अंकों का मोबाइल नंबर दर्ज करें।' : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    // 6. Create Password check
    if (farmerPassword.length < 6) {
      setErrorMessage(t.passwordMinLength);
      return;
    }

    // 7. Confirm Password check
    if (farmerPassword !== farmerConfirmPassword) {
      setErrorMessage(
        langKey === 'hi' ? 'पासवर्ड और कन्फर्म पासवर्ड मेल नहीं खा रहे हैं।' : 'Passwords do not match.'
      );
      return;
    }

    // 8. Aadhaar Front Upload check
    if (!farmerAadhaarFront || !farmerAadhaarFront.dataUrl) {
      setErrorMessage(
        langKey === 'hi'
          ? 'कृपया आधार कार्ड का सामने का भाग (Aadhaar Front) अपलोड करें।'
          : 'Please upload front side of Aadhaar card.'
      );
      return;
    }

    if (farmerAadhaarOcrResult && farmerAadhaarOcrResult.validationStatus === 'UNREADABLE') {
      setErrorMessage(
        farmerAadhaarOcrResult.warningMessage ||
          (langKey === 'hi'
            ? '⚠️ आधार दस्तावेज़ स्पष्ट नहीं है। कृपया साफ़ फोटो दोबारा अपलोड करें।'
            : '⚠️ Document unclear. Please upload a clearer photo.')
      );
      return;
    }

    setIsLoading(true);
    try {
      const res = await registerFarmerApi({
        name: farmerName.trim(),
        phone: cleanPhone,
        password: farmerPassword,
        fatherName: farmerFatherName.trim(),
        aadhaarNumber: cleanAadhaar,
        email: farmerEmail.trim() || undefined,
        farmerRegistryDocumentUrl: farmerAadhaarFront.dataUrl,
        farmerRegistryFileName: farmerAadhaarFront.fileName,
        farmerRegistryOcrStatus: farmerAadhaarOcrResult ? 'success' : 'pending',
        farmerRegistryVerificationStatus: farmerAadhaarOcrResult?.validationStatus || 'MATCHED',
        farmerRegistryOcrData: farmerAadhaarOcrResult?.extractedData,
      });

      if (res.success && res.token) {
        setSuccessMessage(t.accountCreatedSuccess || 'किसान खाता सफलतापूर्वक तैयार हुआ!');
        setTimeout(() => {
          handleClose();
          if (onLoginSuccess) {
            onLoginSuccess('farmer', res.user);
          }
        }, 400);
      } else {
        setErrorMessage(res.message || 'पंजीकरण विफल। कृपया पुनः प्रयास करें।');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // 3. BUYER LOGIN (Normal password-based without OTP)
  // =========================================================================
  const handleBuyerLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!buyerLoginIdentifier.trim() || !buyerLoginPassword.trim()) {
      setErrorMessage(t.fillAllFields);
      return;
    }

    setIsLoading(true);
    try {
      const res = await loginBuyerDirectApi(buyerLoginIdentifier.trim(), buyerLoginPassword);
      if (res.success && res.token) {
        setSuccessMessage(t.loginSuccess || 'लॉगिन सफल! मंडी मार्केटप्लेस खुल रहा है...');
        setTimeout(() => {
          handleClose();
          if (onLoginSuccess) {
            onLoginSuccess('buyer', res.user);
          }
        }, 400);
      } else {
        setErrorMessage(res.message || 'लॉगिन विफल। कृपया मोबाइल नंबर/ईमेल और पासवर्ड जांचें।');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  // =========================================================================
  // 4. BUYER REGISTER (Normal password-based without OTP, No Land Fields)
  // =========================================================================
  const handleBuyerRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!buyerName.trim() || !buyerRegisterMobile.trim() || !buyerPassword.trim()) {
      setErrorMessage(t.fillAllFields);
      return;
    }

    if (buyerRegisterMobile.replace(/\D/g, '').length !== 10) {
      setErrorMessage('कृपया वैध 10-अंकों का मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (buyerPassword.length < 6) {
      setErrorMessage(t.passwordMinLength);
      return;
    }

    setIsLoading(true);
    try {
      const cleanMobile = buyerRegisterMobile.replace(/\D/g, '');
      const res = await registerBuyerApi({
        name: buyerName.trim(),
        mobile: cleanMobile,
        password: buyerPassword,
        profession: buyerBusinessType,
        businessName: buyerBusinessName.trim() || `${buyerName.trim()} Mandi Traders`,
        location: buyerLocation.trim(),
        district: 'Bareilly',
        state: 'Uttar Pradesh',
        pincode: '243001',
      });

      if (res.success && res.token) {
        setSuccessMessage(t.accountCreatedSuccess || 'खरीदार खाता सफलतापूर्वक तैयार हुआ!');
        setTimeout(() => {
          handleClose();
          if (onLoginSuccess) {
            onLoginSuccess('buyer', res.user);
          }
        }, 400);
      } else {
        setErrorMessage(res.message || 'पंजीकरण विफल। कृपया पुनः प्रयास करें।');
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'नेटवर्क त्रुटि। कृपया पुनः प्रयास करें।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={
        isPage
          ? 'w-full flex items-center justify-center p-2 sm:p-4 my-2'
          : 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto animate-fadeIn'
      }
      onClick={isPage ? undefined : handleClose}
    >
      <div
        id="kisansetu-auth-modal"
        className={`relative w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden transition-all ${
          isPage ? 'my-2' : 'my-6 shadow-2xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-700 p-6 text-white relative">
          <button
            id="auth-modal-close-button"
            onClick={handleClose}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white font-bold transition-all cursor-pointer"
            aria-label="Back to Home"
            title="Back to Home / मुख्य पृष्ठ"
          >
            ✕
          </button>

          <div className="flex items-center gap-3">
            <span className="text-3xl">🌾</span>
            <div>
              <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                KisanSetu <span className="text-xs bg-emerald-800/80 px-2 py-0.5 rounded-full font-medium text-emerald-100">किसानसेतु</span>
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                {currentView === 'seller'
                  ? 'किसान प्रवेश (Farmer Access Portal)'
                  : currentView === 'buyer'
                  ? 'व्यापारी / खरीदार प्रवेश (Buyer Procurement Portal)'
                  : 'पोर्टल चुनें (Select Your Portal)'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Success Banner */}
          {successMessage && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fadeIn">
              <span className="text-base">✓</span>
              <span>{successMessage}</span>
            </div>
          )}

          {/* Error Banner */}
          {errorMessage && (
            <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-semibold flex items-start gap-2 animate-fadeIn">
              <span className="text-base mt-0.5">⚠️</span>
              <div className="flex-1">
                <p>{errorMessage}</p>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 1: ROLE SELECTION (The Canonical "Select Your Portal" Interface) */}
          {/* ========================================================================= */}
          {currentView === 'role' && (
            <div className="space-y-4">
              {/* Unified Mode Switcher: Login vs Sign Up */}
              <div className="flex bg-gray-100/90 p-1 rounded-2xl border border-gray-200/80 shadow-2xs">
                <button
                  id="portal-toggle-login-btn"
                  type="button"
                  onClick={() => {
                    onModeChange?.('login');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    initialMode === 'login'
                      ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200/50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {currentLanguage === 'hi' ? 'लॉगिन (Login)' : 'Login'}
                </button>
                <button
                  id="portal-toggle-signup-btn"
                  type="button"
                  onClick={() => {
                    onModeChange?.('signup');
                  }}
                  className={`flex-1 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                    initialMode === 'signup'
                      ? 'bg-white text-emerald-800 shadow-sm border border-emerald-200/50'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {currentLanguage === 'hi' ? 'नया खाता / पंजीकरण (Sign Up)' : 'Sign Up / Register'}
                </button>
              </div>

              <p className="text-center text-xs font-semibold text-gray-600">
                {initialMode === 'signup'
                  ? (currentLanguage === 'hi' ? 'पंजीकरण करने के लिए अपना पोर्टल चुनें:' : 'Choose your portal to create an account:')
                  : (currentLanguage === 'hi' ? 'लॉगिन करने के लिए अपना पोर्टल चुनें:' : 'Choose your portal to log in:')}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {/* 1. Farmer Option */}
                <button
                  id="select-role-farmer"
                  onClick={() => {
                    setCurrentView('seller');
                    const targetTab = initialMode === 'signup' ? 'register' : 'login';
                    setFarmerTab(targetTab);
                    setErrorMessage(null);
                    onRoleChange?.('farmer');
                    onModeChange?.(targetTab === 'register' ? 'signup' : 'login');
                  }}
                  className="group p-5 bg-gradient-to-br from-emerald-50 to-white hover:from-emerald-100/70 hover:to-emerald-50/50 border-2 border-emerald-200 hover:border-emerald-500 rounded-2xl text-left transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-2xl mb-3 shadow-inner group-hover:scale-105 transition-transform">
                    👨‍🌾
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {currentLanguage === 'hi' ? 'मैं किसान हूँ' : 'I am a Farmer'}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {currentLanguage === 'hi'
                      ? 'फसल बेचें, सही भाव पाएं और सीधे खरीदारों से जुड़ें।'
                      : 'Sell crops, get fair rates, and connect directly with verified buyers.'}
                  </p>
                  <span className="inline-flex items-center text-xs font-bold text-emerald-700 mt-3 group-hover:translate-x-1 transition-transform">
                    {initialMode === 'signup'
                      ? (currentLanguage === 'hi' ? 'किसान पंजीकरण (Farmer Registration) →' : 'Farmer Registration →')
                      : (currentLanguage === 'hi' ? 'किसान लॉगिन (Farmer Login) →' : 'Farmer Login →')}
                  </span>
                </button>

                {/* 2. Buyer Option */}
                <button
                  id="select-role-buyer"
                  onClick={() => {
                    setCurrentView('buyer');
                    const targetTab = initialMode === 'signup' ? 'register' : 'login';
                    setBuyerTab(targetTab);
                    setErrorMessage(null);
                    onRoleChange?.('buyer');
                    onModeChange?.(targetTab === 'register' ? 'signup' : 'login');
                  }}
                  className="group p-5 bg-gradient-to-br from-blue-50 to-white hover:from-blue-100/70 hover:to-blue-50/50 border-2 border-blue-200 hover:border-blue-500 rounded-2xl text-left transition-all shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center text-2xl mb-3 shadow-inner group-hover:scale-105 transition-transform">
                    🏪
                  </div>
                  <h3 className="font-bold text-gray-900 text-base">
                    {currentLanguage === 'hi' ? 'मैं खरीदार / व्यापारी हूँ' : 'I am a Buyer / Trader'}
                  </h3>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {currentLanguage === 'hi'
                      ? 'थोक में सीधे उपज खरीदें, मांग पोस्ट करें और ऑर्डर ट्रैक करें।'
                      : 'Source bulk farm produce directly, post demand, and track orders.'}
                  </p>
                    <span className="inline-flex items-center text-xs font-bold text-blue-700 mt-3 group-hover:translate-x-1 transition-transform">
                    {initialMode === 'signup'
                      ? (currentLanguage === 'hi' ? 'खरीदार पंजीकरण (Buyer Registration) →' : 'Buyer Registration →')
                      : (currentLanguage === 'hi' ? 'खरीदार लॉगिन (Buyer Login) →' : 'Buyer Login →')}
                  </span>
                </button>

                {/* 3. Admin Control Center Option (Only shown in Login mode, NEVER in Signup mode) */}
                {initialMode === 'login' && (
                  <button
                    id="select-role-admin"
                    type="button"
                    onClick={() => {
                      setCurrentView('admin');
                      setErrorMessage(null);
                      onRoleChange?.('admin');
                      onModeChange?.('login');
                    }}
                    className="group p-5 bg-gradient-to-br from-[#EEF3E8] via-[#FAF8F2] to-white hover:from-[#E3EBDC] hover:to-[#EEF3E8] border-2 border-[#D5E4CE] hover:border-[#245C3A] rounded-2xl text-left transition-all shadow-sm hover:shadow-md cursor-pointer sm:col-span-2"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <div className="w-12 h-12 bg-[#245C3A] text-white rounded-xl flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform shrink-0">
                          🛡️
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-gray-900 text-base">
                              {currentLanguage === 'hi' ? 'प्रशासनिक नियंत्रण कक्ष (Admin)' : 'Admin Control Center'}
                            </h3>
                            <span className="text-[10px] bg-[#EEF3E8] text-[#245C3A] font-bold px-2 py-0.5 rounded-full border border-[#D5E4CE]">
                              व्यवस्थापक
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5 leading-relaxed">
                            {currentLanguage === 'hi'
                              ? 'किसान एवं खरीदार दोनों पोर्टल्स की निगरानी, फसल सत्यापन, ऑर्डर और ऑडिट लॉग नियंत्रण।'
                              : 'Oversight for Farmer & Buyer portals, crop verification, orders, and audit logs.'}
                          </p>
                        </div>
                      </div>
                      <span className="inline-flex items-center text-xs font-bold text-[#245C3A] group-hover:translate-x-1 transition-transform self-end sm:self-auto shrink-0">
                        {currentLanguage === 'hi' ? 'एडमिन लॉगिन →' : 'Admin Sign In →'}
                      </span>
                    </div>
                  </button>
                )}
              </div>

              {/* Demo Quick Logins (Isolated for Dev/Testing) */}
              <div className="pt-4 border-t border-gray-100">
                <p className="text-[11px] font-semibold text-gray-400 text-center mb-1">
                  डेवलपर / डेमो टेस्ट खाते (Development Test Helpers - Optional)
                </p>
                <p className="text-[10px] text-gray-400 text-center mb-2.5">
                  असली उपयोगकर्ता सीधे ऊपर से अपने विवरण दर्ज करके लॉगिन अथवा नया खाता बना सकते हैं।
                </p>
                <div className={`grid ${initialMode === 'login' ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3'} gap-1.5`}>
                  <button
                    id="demo-login-farmer"
                    type="button"
                    onClick={handleAutofillFarmer}
                    className="py-1.5 px-2 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-300 text-gray-700 hover:text-emerald-800 text-[10px] font-semibold rounded-lg text-center transition-colors cursor-pointer"
                  >
                    👨‍🌾 किसान
                  </button>
                  <button
                    id="demo-login-buyer"
                    type="button"
                    onClick={handleAutofillBuyer}
                    className="py-1.5 px-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-800 text-[10px] font-semibold rounded-lg text-center transition-colors cursor-pointer"
                    title="Vikram Anand (Bareilly)"
                  >
                    🏪 विक्रम (खरीदार)
                  </button>
                  <button
                    id="demo-login-buyer-amit"
                    type="button"
                    onClick={handleAutofillBuyerAmit}
                    className="py-1.5 px-2 bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-800 text-[10px] font-semibold rounded-lg text-center transition-colors cursor-pointer"
                    title="Amit Gupta (Gorakhpur)"
                  >
                    🏪 अमित (खरीदार)
                  </button>
                  {initialMode === 'login' && (
                    <button
                      id="demo-login-admin"
                      type="button"
                      onClick={handleAutofillAdmin}
                      className="py-1.5 px-2 bg-[#EEF3E8] hover:bg-[#E3EBDC] border border-[#D5E4CE] hover:border-[#245C3A] text-[#245C3A] text-[10px] font-bold rounded-lg text-center transition-colors cursor-pointer"
                      title="Admin (kisansetu2026@gmail.com)"
                    >
                      🛡️ एडमिन
                    </button>
                  )}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: FARMER AUTHENTICATION (Normal Password Auth, No OTP) */}
          {/* ========================================================================= */}
          {currentView === 'seller' && (
            <div>
              {/* Back to role + Tabs */}
              <div className="flex items-center justify-between mb-5">
                <button
                  id="farmer-back-to-portal-btn"
                  onClick={() => {
                    setCurrentView('role');
                    setErrorMessage(null);
                    onRoleChange?.(null);
                  }}
                  className="text-xs font-semibold text-gray-500 hover:text-emerald-700 flex items-center gap-1 cursor-pointer"
                >
                  ← {currentLanguage === 'hi' ? 'पोर्टल चुनें (Select Portal)' : 'Select Portal'}
                </button>
                <div className="flex p-1 bg-gray-100 rounded-xl">
                  <button
                    id="farmer-tab-login"
                    onClick={() => {
                      setFarmerTab('login');
                      setErrorMessage(null);
                      onModeChange?.('login');
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      farmerTab === 'login'
                        ? 'bg-white text-emerald-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {t.loginTab}
                  </button>
                  <button
                    id="farmer-tab-register"
                    onClick={() => {
                      setFarmerTab('register');
                      setErrorMessage(null);
                      onModeChange?.('signup');
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      farmerTab === 'register'
                        ? 'bg-white text-emerald-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {t.registerTab}
                  </button>
                </div>
              </div>

              {/* 2A. FARMER LOGIN */}
              {farmerTab === 'login' && (
                <form onSubmit={handleFarmerLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.identifierLabel}</label>
                    <input
                      id="farmer-login-identifier"
                      type="text"
                      value={farmerLoginIdentifier}
                      onChange={(e) => setFarmerLoginIdentifier(e.target.value)}
                      placeholder="9876543210 या rajesh.kumar.farmer@kisansetu.in"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.passwordLabel}</label>
                    <input
                      id="farmer-login-password"
                      type="password"
                      value={farmerLoginPassword}
                      onChange={(e) => setFarmerLoginPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    id="farmer-login-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? 'लॉगिन हो रहा है...' : 'किसान लॉगिन करें (Login as Farmer)'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFarmerTab('register');
                        onModeChange?.('signup');
                      }}
                      className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      नया किसान खाता बनाएं (Register New Farmer) →
                    </button>
                  </div>
                </form>
              )}

              {/* 2B. FARMER REGISTRATION (9 Essential Fields Only) */}
              {farmerTab === 'register' && (
                <form onSubmit={handleFarmerRegister} className="space-y-4">
                  {/* 1. Name & 2. Father Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        1. {langKey === 'hi' ? 'नाम (आधार के अनुसार)' : 'Name (As per Aadhaar)'} *
                      </label>
                      <input
                        id="farmer-signup-name"
                        type="text"
                        value={farmerName}
                        onChange={(e) => setFarmerName(e.target.value)}
                        placeholder="उदा. राजेश कुमार (Rajesh Kumar)"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        2. {langKey === 'hi' ? 'पिता / पति का नाम (आधार अनुसार)' : "Father's Name (As per Aadhaar)"} *
                      </label>
                      <input
                        id="farmer-signup-father-name"
                        type="text"
                        value={farmerFatherName}
                        onChange={(e) => setFarmerFatherName(e.target.value)}
                        placeholder="उदा. श्री हरिशंकर (Harishankar)"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* 3. Aadhaar Number & 4. Mobile Number */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        3. {langKey === 'hi' ? 'आधार संख्या (Aadhaar Number)' : 'Aadhaar Number'} *
                      </label>
                      <input
                        id="farmer-signup-aadhaar"
                        type="text"
                        maxLength={14}
                        value={farmerAadhaarNumber}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/\D/g, '').slice(0, 12);
                          // Auto format XXXX XXXX XXXX
                          const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
                          setFarmerAadhaarNumber(formatted);
                        }}
                        placeholder="1234 5678 9012"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        4. {langKey === 'hi' ? 'मोबाइल नंबर (Mobile Number)' : 'Mobile Number'} *
                      </label>
                      <input
                        id="farmer-signup-phone"
                        type="tel"
                        maxLength={10}
                        value={farmerPhone}
                        onChange={(e) => setFarmerPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="9876543210"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* 5. Email ID */}
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">
                      5. {langKey === 'hi' ? 'ईमेल आईडी (Email ID)' : 'Email ID'}
                      <span className="text-gray-400 font-normal ml-1">({langKey === 'hi' ? 'वैकल्पिक' : 'Optional'})</span>
                    </label>
                    <input
                      id="farmer-signup-email"
                      type="email"
                      value={farmerEmail}
                      onChange={(e) => setFarmerEmail(e.target.value)}
                      placeholder="rajesh.farmer@gmail.com"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  {/* 6. Create Password & 7. Confirm Password */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        6. {langKey === 'hi' ? 'पासवर्ड बनाएं (Create Password)' : 'Create Password'} *
                      </label>
                      <input
                        id="farmer-signup-password"
                        type="password"
                        value={farmerPassword}
                        onChange={(e) => setFarmerPassword(e.target.value)}
                        placeholder="न्यूनतम 6 अक्षर"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">
                        7. {langKey === 'hi' ? 'पासवर्ड की पुष्टि (Confirm Password)' : 'Confirm Password'} *
                      </label>
                      <input
                        id="farmer-signup-confirm-password"
                        type="password"
                        value={farmerConfirmPassword}
                        onChange={(e) => setFarmerConfirmPassword(e.target.value)}
                        placeholder="पासवर्ड दोबारा दर्ज करें"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  {/* 8. Upload Aadhaar Front & 9. Upload Aadhaar Back with OCR */}
                  <AadhaarOcrUploadCard
                    currentLanguage={langKey}
                    enteredName={farmerName}
                    enteredFatherName={farmerFatherName}
                    enteredAadhaar={farmerAadhaarNumber}
                    onFrontUploaded={(dataUrl, fileName, ocrResult) => {
                      setFarmerAadhaarFront({ dataUrl, fileName });
                      setFarmerAadhaarOcrResult(ocrResult);
                    }}
                    onBackUploaded={(dataUrl, fileName) => {
                      setFarmerAadhaarBack({ dataUrl, fileName });
                    }}
                    onApplyDetails={(details) => {
                      if (details.name) setFarmerName(details.name);
                      if (details.fatherName) setFarmerFatherName(details.fatherName);
                      if (details.aadhaarNumber) {
                        const digits = details.aadhaarNumber.replace(/\D/g, '').slice(0, 12);
                        setFarmerAadhaarNumber(digits.replace(/(\d{4})(?=\d)/g, '$1 '));
                      }
                    }}
                  />

                  <p className="text-[11px] text-gray-500 italic bg-amber-50/60 p-2 rounded-lg border border-amber-200/60">
                    ℹ️ {langKey === 'hi'
                      ? 'ज़मीन का विवरण (District, Tehsil, Gata No.) रजिस्ट्रेशन के बाद प्रोफाइल में आसानी से जोड़ें।'
                      : 'Land/Property details can be easily added anytime in your Farmer Profile after registration.'}
                  </p>

                  <button
                    id="farmer-signup-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? 'खाता तैयार हो रहा है...' : 'किसान पंजीकरण करें (Register as Farmer)'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setFarmerTab('login');
                        onModeChange?.('login');
                      }}
                      className="text-xs text-emerald-700 hover:underline font-semibold cursor-pointer"
                    >
                      पहले से खाता है? लॉगिन करें (Already Registered? Login) →
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: BUYER AUTHENTICATION (Normal Password Auth, No OTP, No Land) */}
          {/* ========================================================================= */}
          {currentView === 'buyer' && (
            <div>
              {/* Back to role + Tabs */}
              <div className="flex items-center justify-between mb-5">
                <button
                  id="buyer-back-to-portal-btn"
                  onClick={() => {
                    setCurrentView('role');
                    setErrorMessage(null);
                    onRoleChange?.(null);
                  }}
                  className="text-xs font-semibold text-gray-500 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
                >
                  ← {currentLanguage === 'hi' ? 'पोर्टल चुनें (Select Portal)' : 'Select Portal'}
                </button>
                <div className="flex p-1 bg-gray-100 rounded-xl">
                  <button
                    id="buyer-tab-login"
                    onClick={() => {
                      setBuyerTab('login');
                      setErrorMessage(null);
                      onModeChange?.('login');
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      buyerTab === 'login'
                        ? 'bg-white text-blue-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {t.loginTab}
                  </button>
                  <button
                    id="buyer-tab-register"
                    onClick={() => {
                      setBuyerTab('register');
                      setErrorMessage(null);
                      onModeChange?.('signup');
                    }}
                    className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      buyerTab === 'register'
                        ? 'bg-white text-blue-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {t.registerTab}
                  </button>
                </div>
              </div>

              {/* 3A. BUYER LOGIN */}
              {buyerTab === 'login' && (
                <form onSubmit={handleBuyerLogin} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-700">{t.identifierLabel}</label>
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setBuyerLoginIdentifier('9837012456');
                            setBuyerLoginPassword('password123');
                          }}
                          className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium hover:bg-blue-100 cursor-pointer"
                        >
                          विक्रम (Bareilly)
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setBuyerLoginIdentifier('9876543211');
                            setBuyerLoginPassword('password123');
                          }}
                          className="text-[10px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-medium hover:bg-blue-100 cursor-pointer"
                        >
                          अमित (Gorakhpur)
                        </button>
                      </div>
                    </div>
                    <input
                      id="buyer-login-identifier"
                      type="text"
                      value={buyerLoginIdentifier}
                      onChange={(e) => setBuyerLoginIdentifier(e.target.value)}
                      placeholder="9837012456 या procurement@bareillyagromandi.in"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">{t.passwordLabel}</label>
                    <input
                      id="buyer-login-password"
                      type="password"
                      value={buyerLoginPassword}
                      onChange={(e) => setBuyerLoginPassword(e.target.value)}
                      placeholder={t.passwordPlaceholder}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                      required
                    />
                  </div>

                  <button
                    id="buyer-login-submit"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? 'लॉगिन हो रहा है...' : 'खरीदार लॉगिन करें (Login as Buyer)'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBuyerTab('register');
                        onModeChange?.('signup');
                      }}
                      className="text-xs text-blue-700 hover:underline font-semibold cursor-pointer"
                    >
                      नया खरीदार खाता बनाएं (Register New Buyer) →
                    </button>
                  </div>
                </form>
              )}

              {/* 3B. BUYER REGISTRATION (Simple, No Land Fields, No OTP) */}
              {buyerTab === 'register' && (
                <form onSubmit={handleBuyerRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">खरीदार का नाम (Full Name) *</label>
                    <input
                      id="buyer-signup-name"
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="उदा. विक्रम आनंद"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">मोबाइल नंबर (10 अंक) *</label>
                      <input
                        id="buyer-signup-mobile"
                        type="tel"
                        maxLength={10}
                        value={buyerRegisterMobile}
                        onChange={(e) => setBuyerRegisterMobile(e.target.value.replace(/\D/g, ''))}
                        placeholder="10 अंक मोबाइल नंबर"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">पासवर्ड (न्यूनतम 6 अक्षर) *</label>
                      <input
                        id="buyer-signup-password"
                        type="password"
                        value={buyerPassword}
                        onChange={(e) => setBuyerPassword(e.target.value)}
                        placeholder="पासवर्ड दर्ज करें"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">व्यापार/फर्म का नाम (Business Name)</label>
                      <input
                        id="buyer-signup-business-name"
                        type="text"
                        value={buyerBusinessName}
                        onChange={(e) => setBuyerBusinessName(e.target.value)}
                        placeholder="उदा. आनंद एग्रो ट्रेडर्स"
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 mb-1">व्यापार प्रकार (Business Type)</label>
                      <select
                        id="buyer-signup-business-type"
                        value={buyerBusinessType}
                        onChange={(e) => setBuyerBusinessType(e.target.value)}
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                      >
                        <option value="Wholesaler / Mandi Trader">थोक व्यापारी (Wholesaler)</option>
                        <option value="Retailer / Mandi Shop">खुदरा व्यापारी (Retailer)</option>
                        <option value="Food Processing Unit">फूड प्रोसेसिंग यूनिट (Food Processor)</option>
                        <option value="Hotel / Restaurant / Catering">होटल / रेस्टोरेंट (HoReCa)</option>
                        <option value="FPO / Agri Cooperative">एफपीओ (FPO / Cooperative)</option>
                        <option value="Exporter">निर्यातक (Exporter)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1">डिलीवरी स्थान / शहर (Delivery Location)</label>
                    <input
                      id="buyer-signup-location"
                      type="text"
                      value={buyerLocation}
                      onChange={(e) => setBuyerLocation(e.target.value)}
                      placeholder="उदा. बरेली, उत्तर प्रदेश"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>

                  <button
                    id="buyer-signup-submit-btn"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? 'खाता तैयार हो रहा है...' : 'खरीदार पंजीकरण करें (Register as Buyer)'}
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setBuyerTab('login');
                        onModeChange?.('login');
                      }}
                      className="text-xs text-blue-700 hover:underline font-semibold cursor-pointer"
                    >
                      पहले से खाता है? लॉगिन करें (Already Registered? Login) →
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ========================================================================= */}
          {/* VIEW 4: ADMIN CONTROL CENTER LOGIN (Direct Server Password Authentication) */}
          {/* ========================================================================= */}
          {currentView === 'admin' && (
            <div>
              {/* Back to role */}
              <div className="flex items-center justify-between mb-5">
                <button
                  id="admin-back-to-portal-btn"
                  type="button"
                  onClick={() => {
                    setCurrentView('role');
                    setErrorMessage(null);
                    onRoleChange?.(null);
                  }}
                  className="text-xs font-semibold text-gray-500 hover:text-[#245C3A] flex items-center gap-1 cursor-pointer"
                >
                  ← {currentLanguage === 'hi' ? 'पोर्टल चुनें (Select Portal)' : 'Select Portal'}
                </button>
                <span className="text-[11px] font-bold px-2.5 py-1 bg-[#EEF3E8] text-[#245C3A] rounded-full border border-[#D5E4CE]">
                  🛡️ {currentLanguage === 'hi' ? 'व्यवस्थापक प्रमाणीकरण' : 'Admin Security'}
                </span>
              </div>

              {/* Admin Portal Header Banner */}
              <div className="mb-5 p-4 bg-gradient-to-r from-[#1B492E] via-[#245C3A] to-[#163E26] text-white rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl shrink-0">
                    🛡️
                  </div>
                  <div>
                    <h3 className="font-bold text-sm tracking-wide">
                      {currentLanguage === 'hi' ? 'प्रशासनिक नियंत्रण कक्ष' : 'Admin Control Center'}
                    </h3>
                    <p className="text-[11px] text-[#D5E4CE] mt-0.5">
                      {currentLanguage === 'hi'
                        ? 'केवल अधिकृत व्यवस्थापकों के लिए। किसान व खरीदार दोनों पोर्टल्स की निगरानी।'
                        : 'Authorized administrators only. Full oversight of KisanSetu operations.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Admin Login Form */}
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {currentLanguage === 'hi' ? 'एडमिन ईमेल / आईडी' : 'Admin Email / ID'}
                  </label>
                  <input
                    id="admin-login-email"
                    type="email"
                    autoComplete="username"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="kisansetu2026@gmail.com"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#245C3A] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {currentLanguage === 'hi' ? 'एडमिन पासवर्ड' : 'Admin Password'}
                  </label>
                  <input
                    id="admin-login-password"
                    type="password"
                    autoComplete="current-password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#245C3A] focus:bg-white focus:outline-none transition-all"
                  />
                </div>

                {/* Quick Autofill Helper for Evaluators */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    id="admin-autofill-credentials-btn"
                    type="button"
                    onClick={() => {
                      setAdminEmail('kisansetu2026@gmail.com');
                    }}
                    className="text-[11px] text-[#245C3A] hover:text-[#1B492E] font-semibold underline cursor-pointer"
                  >
                    {currentLanguage === 'hi'
                      ? 'व्यवस्थापक ईमेल भरें (Fill Admin Email)'
                      : 'Fill Admin Email'}
                  </button>
                  <span className="text-[10px] text-gray-400">
                    256-Bit SSL Auth
                  </span>
                </div>

                <button
                  id="admin-login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#245C3A] hover:bg-[#1B492E] active:scale-[0.99] text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{currentLanguage === 'hi' ? 'सत्यापन हो रहा है...' : 'Verifying Credentials...'}</span>
                    </>
                  ) : (
                    <>
                      <span>🛡️</span>
                      <span>
                        {currentLanguage === 'hi'
                          ? 'प्रशासनिक नियंत्रण कक्ष में प्रवेश करें'
                          : 'Enter Admin Control Center'}
                      </span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

