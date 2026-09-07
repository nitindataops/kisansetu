import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  Search,
  Plus,
  ShoppingBag,
  Package,
  MessageSquare,
  Bell,
  User,
  LogOut,
  Globe,
  ShieldCheck,
  ChevronDown,
  X,
  Home,
  Sparkles,
  TrendingUp,
  Menu as MenuIcon,
  Mic,
  Brain,
} from 'lucide-react';
import { FarmerDashboardTab, FarmerProfile } from '../../types/farmer';
import { LanguageCode } from '../../types';
import { getFarmerTranslations } from '../../data/farmerTranslations';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface FarmerNavbarProps {
  currentTab: FarmerDashboardTab;
  onSelectTab: (tab: FarmerDashboardTab) => void;
  onOpenSellModal: () => void;
  onOpenAiAssistant: (initialPrompt?: string) => void;
  onLogout: () => void;
  profile: FarmerProfile;
  unreadNotifsCount: number;
  unresolvedEnquiriesCount: number;
  activeOrdersCount?: number;
  activeCropsCount?: number;
  currentLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onPerformSearch: (q: string) => void;
  onSwitchToBuyer?: () => void;
}

export const FarmerNavbar: React.FC<FarmerNavbarProps> = ({
  currentTab,
  onSelectTab,
  onOpenSellModal,
  onOpenAiAssistant,
  onLogout,
  profile,
  unreadNotifsCount,
  unresolvedEnquiriesCount,
  activeOrdersCount = 0,
  activeCropsCount = 0,
  currentLanguage,
  onSelectLanguage,
  searchQuery,
  onSearchChange,
  onPerformSearch,
  onSwitchToBuyer,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  const t = getFarmerTranslations(currentLanguage);
  const navT = t.nav;
  const isHi = currentLanguage === 'hi';

  const languages: { code: LanguageCode; label: string; native: string }[] = [
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'en', label: 'English', native: 'English' },
    { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
    { code: 'hr', label: 'Haryanvi', native: 'हरियाणवी' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
  ];

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langDropdownRef.current && !langDropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    }
    if (isLangDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isLangDropdownOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onPerformSearch(searchQuery);
      setIsMobileSearchOpen(false);
    }
  };

  const handleMenuSelect = (tab: FarmerDashboardTab) => {
    onSelectTab(tab);
    setIsMenuOpen(false);
  };

  const currentLangObj = languages.find((l) => l.code === currentLanguage) || languages[0];

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MAIN FARMER HEADER / NAVBAR (STRICTLY 6 REQUESTED ITEMS)               */}
      {/* 1. 🔍 Search Engine | 2. 🏠 Home | 3. 🌐 Language | 4. 🤖 AI Assistant |   */}
      {/* 5. 🧠 AI Analysis | 6. ☰ Menu                                            */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white border-b border-[#EEF3E8] shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
            {/* Left: Brand Logo & Title */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              <button
                id="farmer-nav-logo"
                onClick={() => onSelectTab('overview')}
                className="flex items-center gap-2 group text-left cursor-pointer focus:outline-hidden"
                title="KisanSetu Farmer Home"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#245C3A] to-[#1B432B] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                  <span className="text-xl">🌱</span>
                </div>
                <div className="hidden min-[380px]:block">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-black text-xl tracking-tight text-[#245C3A] leading-none">
                      KisanSetu
                    </span>
                    <span className="text-[10px] uppercase font-black px-1.5 py-0.5 rounded-md bg-[#245C3A]/10 text-[#245C3A] tracking-wider border border-[#245C3A]/20">
                      {isHi ? 'किसान' : 'Farmer'}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#68736B] block leading-none font-medium mt-0.5">
                    {navT.brandSubtitle}
                  </span>
                </div>
              </button>
            </div>

            {/* ITEM 1: 🔍 Search Engine (Desktop & Large screens) */}
            <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-2 lg:mx-4">
              <form onSubmit={handleSearchSubmit} className="w-full relative">
                <div className="relative flex items-center">
                  <input
                    id="farmer-main-search-input"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={navT.searchPlaceholder}
                    className="w-full pl-10 pr-20 py-2 sm:py-2.5 bg-[#FBFAF4] hover:bg-white focus:bg-white text-xs sm:text-sm text-[#26332B] placeholder:text-[#8D9B91] rounded-2xl border border-[#EEF3E8] focus:border-[#245C3A] focus:ring-2 focus:ring-[#5F8F45]/20 transition-all font-medium shadow-2xs"
                  />
                  <Search className="w-4 h-4 text-[#5F8F45] absolute left-3.5 pointer-events-none" />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => onSearchChange('')}
                      className="absolute right-14 text-gray-400 hover:text-gray-600 text-xs px-1 cursor-pointer"
                      title="Clear"
                    >
                      ✕
                    </button>
                  )}
                  <button
                    type="submit"
                    className="absolute right-1.5 px-3 py-1 rounded-xl bg-[#245C3A] hover:bg-[#1E4D31] text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    {navT.searchBtn}
                  </button>
                </div>
              </form>
            </div>

            {/* Right Group: 1. 🔍 Search (Mobile) | 2. 🏠 Home | 3. 🌐 Language | 4. 🤖 AI Assistant | 5. 🧠 AI Analysis | 6. ☰ Menu */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* ITEM 1 (Mobile): 🔍 Search Toggle Button */}
              <button
                id="farmer-mobile-search-toggle"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
                className={`p-2 rounded-xl border transition-colors md:hidden cursor-pointer ${
                  isMobileSearchOpen
                    ? 'bg-[#245C3A] text-white border-[#245C3A]'
                    : 'bg-[#FBFAF4] hover:bg-[#EEF3E8] border-[#EEF3E8] text-[#245C3A]'
                }`}
                title="Search / खोजें"
                aria-label="Toggle Search"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* ITEM 2: 🏠 Home */}
              <button
                id="farmer-nav-home-btn"
                onClick={() => onSelectTab('overview')}
                className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  currentTab === 'overview'
                    ? 'bg-[#245C3A] text-white border-[#245C3A] shadow-xs'
                    : 'bg-[#FBFAF4] hover:bg-[#EEF3E8] text-[#26332B] border-[#EEF3E8]'
                }`}
                title={navT.home}
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">{navT.home}</span>
              </button>

              {/* ITEM 3: 🌐 Language Changer */}
              <div className="relative" ref={langDropdownRef}>
                <button
                  id="farmer-global-lang-btn"
                  onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                  className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] text-xs font-bold text-[#245C3A] transition-colors cursor-pointer"
                  title="Language Changer / भाषा बदलें"
                >
                  <Globe className="w-4 h-4 text-[#5F8F45]" />
                  <span className="hidden min-[420px]:inline">{currentLangObj.native}</span>
                  <ChevronDown className="w-3 h-3 text-[#68736B]" />
                </button>

                {isLangDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#EEF3E8] p-2 z-50 animate-in fade-in-50 zoom-in-95">
                    <div className="px-2 py-1 text-[11px] font-bold text-[#68736B] uppercase border-b border-[#EEF3E8] mb-1">
                      {isHi ? 'भाषा चुनें' : 'Select Language'}
                    </div>
                    <div className="space-y-1">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          onClick={() => {
                            onSelectLanguage(l.code);
                            setIsLangDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-xs rounded-xl text-left transition-colors flex items-center justify-between cursor-pointer ${
                            currentLanguage === l.code
                              ? 'bg-[#245C3A] text-white font-bold'
                              : 'text-[#26332B] hover:bg-[#EEF3E8]'
                          }`}
                        >
                          <span className="font-semibold">{l.native}</span>
                          <span className="text-[10px] opacity-75">{l.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* ITEM 4: 🎙️ Voice Assistant */}
              <button
                id="farmer-nav-voice-assistant-btn"
                onClick={() => onSelectTab('voice-assistant')}
                className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border shadow-2xs ${
                  currentTab === 'voice-assistant'
                    ? 'bg-[#245C3A] text-white border-[#245C3A]'
                    : 'bg-[#FFFBEF] hover:bg-[#F9F0D2] border-[#D6A63A]/40 text-[#8C6212]'
                }`}
                title={isHi ? 'आवाज सहायक (Farmer Voice Assistant)' : 'Farmer Voice Assistant'}
                aria-label="Farmer Voice Assistant"
              >
                <Mic className="w-4 h-4 text-[#B87A14]" />
                <span className="hidden md:inline">
                  {isHi ? 'आवाज सहायक' : 'Voice Assistant'}
                </span>
              </button>

              {/* ITEM 5: 🧠 AI Analysis */}
              <button
                id="farmer-nav-ai-analysis-btn"
                onClick={() => onSelectTab('ai-analysis')}
                className={`px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                  currentTab === 'ai-analysis'
                    ? 'bg-[#245C3A] text-white border-[#245C3A] shadow-xs'
                    : 'bg-[#FBFAF4] hover:bg-[#EEF3E8] text-[#245C3A] border-[#EEF3E8]'
                }`}
                title={navT.aiAnalysis}
              >
                <Brain className="w-4 h-4 text-[#5F8F45]" />
                <span className="hidden md:inline">{navT.aiAnalysis}</span>
              </button>

              {/* ITEM 6: ☰ Menu Trigger Button (STRICT: Symbol only, NO text 'Menu') */}
              <button
                id="farmer-nav-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`relative p-2.5 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center cursor-pointer shadow-2xs ${
                  isMenuOpen
                    ? 'bg-[#245C3A] text-white border-[#245C3A]'
                    : 'bg-[#FBFAF4] text-[#26332B] border-[#EEF3E8] hover:border-[#245C3A] hover:bg-[#EEF3E8]'
                }`}
                title="Open menu"
                aria-label="Open menu"
              >
                {isMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <MenuIcon className="w-5 h-5 text-[#245C3A]" />
                )}

                {/* Subtle indicator if there are unread messages or notifications */}
                {(unreadNotifsCount > 0 || unresolvedEnquiriesCount > 0) && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#B86F4B] border-2 border-white animate-pulse" />
                )}
              </button>
            </div>
          </div>

          {/* Expandable Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div className="pb-3 pt-1 md:hidden animate-in fade-in-50 slide-in-from-top-2 duration-150">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={navT.searchPlaceholder}
                  autoFocus
                  className="w-full pl-9 pr-16 py-2 bg-[#FBFAF4] text-xs text-[#26332B] placeholder:text-[#8D9B91] rounded-xl border border-[#245C3A]/30 focus:border-[#245C3A] focus:ring-2 focus:ring-[#5F8F45]/20"
                />
                <Search className="w-4 h-4 text-[#5F8F45] absolute left-3 pointer-events-none" />
                <button
                  type="submit"
                  className="absolute right-1 px-2.5 py-1 rounded-lg bg-[#245C3A] text-white text-xs font-bold"
                >
                  {navT.searchBtn}
                </button>
              </form>
            </div>
          )}
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 2. FARMER MENU DRAWER / MODAL (STRICTLY 7 PRIMARY MENU ITEMS)             */}
      {/* 1. 📩 Messages / Enquiries                                                */}
      {/* 2. 🔔 Notifications                                                       */}
      {/* 3. 🤝 Find Buyer                                                          */}
      {/* 4. 📦 Orders                                                              */}
      {/* 5. 👤 Profile                                                             */}
      {/* 6. 🌾 My Crops                                                            */}
      {/* 7. 📊 Mandi Rates                                                         */}
      {/* ========================================================================= */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMenuOpen(false)}
          />

          {/* Drawer Content */}
          <div
            ref={menuRef}
            className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 overflow-hidden"
          >
            {/* Top Drawer Header with Authenticated Farmer Info */}
            <div className="p-4 sm:p-5 bg-gradient-to-br from-[#245C3A] to-[#173D26] text-white relative">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 text-white font-bold font-serif text-lg flex items-center justify-center shadow-xs">
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
                    <h3 className="font-bold text-base text-white font-serif leading-tight">
                      {profile.name}
                    </h3>
                    <div className="text-xs text-gray-200 font-mono mt-0.5">
                      {profile.farmerId}
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#D6A63A] bg-black/20 px-2 py-0.5 rounded-full border border-[#D6A63A]/30">
                        <ShieldCheck className="w-3 h-3 text-[#D6A63A]" />
                        <span>{navT.eKycVerified}</span>
                      </span>
                      {profile.village && (
                        <span className="text-[11px] text-gray-300">
                          • {profile.village}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* 7 PRIMARY MENU ITEMS LIST */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              <div className="text-[11px] font-black uppercase tracking-wider text-[#68736B] px-2 pt-1 pb-1">
                {isHi ? 'मुख्य सेवाएं (Farmer Navigation)' : 'Farmer Services'}
              </div>

              {/* 🎙️ आवाज सहायक (Voice Assistant) */}
              <button
                id="menu-item-voice-assistant"
                onClick={() => handleMenuSelect('voice-assistant')}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer border ${
                  currentTab === 'voice-assistant'
                    ? 'bg-[#EEF3E8] border-[#245C3A]/30 text-[#245C3A]'
                    : 'bg-[#FBFAF4] hover:bg-[#EEF3E8] border-[#EEF3E8] text-[#26332B]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EEF3E8] text-[#D6A63A] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Mic className="w-5 h-5 text-[#B87A14]" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#26332B] group-hover:text-[#245C3A] transition-colors">
                      {isHi ? '🎙️ आवाज सहायक (Voice Assistant)' : '🎙️ Voice Assistant'}
                    </div>
                    <div className="text-[11px] text-[#68736B]">
                      {isHi ? 'हिंदी में बोलकर मार्गदर्शन व जानकारी पाएं' : 'Get farmer help and guidance in Hindi'}
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-[#245C3A] text-sm">→</span>
              </button>

              {/* 1. 📩 Messages / Enquiries */}
              <button
                id="menu-item-enquiries"
                onClick={() => handleMenuSelect('enquiries')}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer border ${
                  currentTab === 'enquiries'
                    ? 'bg-[#EEF3E8] border-[#245C3A]/30 text-[#245C3A]'
                    : 'bg-[#FBFAF4] hover:bg-[#EEF3E8] border-[#EEF3E8] text-[#26332B]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EEF3E8] text-[#245C3A] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#26332B] group-hover:text-[#245C3A] transition-colors">
                      {isHi ? '📩 संदेश व पूछताछ (Messages / Enquiries)' : '📩 Messages / Enquiries'}
                    </div>
                    <div className="text-[11px] text-[#68736B]">
                      {isHi ? 'खरीदारों के संदेश व पूछताछ' : 'Buyer enquiries & negotiations'}
                    </div>
                  </div>
                </div>

                {unresolvedEnquiriesCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#B86F4B] text-white text-xs font-black shadow-2xs">
                    {unresolvedEnquiriesCount}
                  </span>
                ) : (
                  <span className="text-gray-400 group-hover:text-[#245C3A] text-sm">→</span>
                )}
              </button>

              {/* 2. 🔔 Notifications */}
              <button
                id="menu-item-notifications"
                onClick={() => handleMenuSelect('notifications')}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer border ${
                  currentTab === 'notifications'
                    ? 'bg-[#EEF3E8] border-[#245C3A]/30 text-[#245C3A]'
                    : 'bg-[#FBFAF4] hover:bg-[#EEF3E8] border-[#EEF3E8] text-[#26332B]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EEF3E8] text-[#245C3A] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#26332B] group-hover:text-[#245C3A] transition-colors">
                      {isHi ? '🔔 सूचनाएं (Notifications)' : '🔔 Notifications'}
                    </div>
                    <div className="text-[11px] text-[#68736B]">
                      {isHi ? 'मंडी भाव व ऑर्डर अलर्ट्स' : 'Market alerts & critical updates'}
                    </div>
                  </div>
                </div>

                {unreadNotifsCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#D6A63A] text-[#245C3A] text-xs font-black shadow-2xs">
                    {unreadNotifsCount}
                  </span>
                ) : (
                  <span className="text-gray-400 group-hover:text-[#245C3A] text-sm">→</span>
                )}
              </button>

              {/* 3. 🤝 Find Buyer */}
              <button
                id="menu-item-find-buyer"
                onClick={() => handleMenuSelect('search-buyers')}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer border ${
                  currentTab === 'search-buyers'
                    ? 'bg-[#EEF3E8] border-[#245C3A]/30 text-[#245C3A]'
                    : 'bg-[#FBFAF4] hover:bg-[#EEF3E8] border-[#EEF3E8] text-[#26332B]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EEF3E8] text-[#245C3A] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Search className="w-5 h-5 text-[#245C3A]" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#26332B] group-hover:text-[#245C3A] transition-colors">
                      {isHi ? '🤝 खरीदार खोजें (Find Buyer)' : '🤝 Find Buyer'}
                    </div>
                    <div className="text-[11px] text-[#68736B]">
                      {isHi ? 'सीधे मिलें, खुदरा व थोक खरीदार' : 'Match with direct institutional buyers'}
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-[#245C3A] text-sm">→</span>
              </button>

              {/* 4. 📦 Orders */}
              <button
                id="menu-item-orders"
                onClick={() => handleMenuSelect('orders')}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer border ${
                  currentTab === 'orders'
                    ? 'bg-[#EEF3E8] border-[#245C3A]/30 text-[#245C3A]'
                    : 'bg-[#FBFAF4] hover:bg-[#EEF3E8] border-[#EEF3E8] text-[#26332B]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EEF3E8] text-[#245C3A] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#26332B] group-hover:text-[#245C3A] transition-colors">
                      {isHi ? '📦 ऑर्डर्स (Orders)' : '📦 Orders'}
                    </div>
                    <div className="text-[11px] text-[#68736B]">
                      {isHi ? 'कटाई बिक्री, पिकअप और भुगतान' : 'Sales tracking & pickup schedules'}
                    </div>
                  </div>
                </div>

                {activeOrdersCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#5F8F45]/20 text-[#245C3A] text-xs font-bold">
                    {activeOrdersCount}
                  </span>
                ) : (
                  <span className="text-gray-400 group-hover:text-[#245C3A] text-sm">→</span>
                )}
              </button>

              {/* 5. 👤 Profile */}
              <button
                id="menu-item-profile"
                onClick={() => handleMenuSelect('profile')}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer border ${
                  currentTab === 'profile'
                    ? 'bg-[#EEF3E8] border-[#245C3A]/30 text-[#245C3A]'
                    : 'bg-[#FBFAF4] hover:bg-[#EEF3E8] border-[#EEF3E8] text-[#26332B]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EEF3E8] text-[#245C3A] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#26332B] group-hover:text-[#245C3A] transition-colors">
                      {isHi ? '👤 किसान प्रोफ़ाइल (Profile)' : '👤 Profile'}
                    </div>
                    <div className="text-[11px] text-[#68736B]">
                      {isHi ? 'प्रोफ़ाइल बदलें, खतौनी व भूलेख विवरण' : 'Editable profile, land records & bank DBT'}
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-[#245C3A] text-sm">→</span>
              </button>

              {/* 6. 🌾 My Crops */}
              <button
                id="menu-item-my-crops"
                onClick={() => handleMenuSelect('my-crops')}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer border ${
                  currentTab === 'my-crops'
                    ? 'bg-[#EEF3E8] border-[#245C3A]/30 text-[#245C3A]'
                    : 'bg-[#FBFAF4] hover:bg-[#EEF3E8] border-[#EEF3E8] text-[#26332B]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EEF3E8] text-[#245C3A] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#26332B] group-hover:text-[#245C3A] transition-colors">
                      {isHi ? '🌾 मेरी फसलें (My Crops)' : '🌾 My Crops'}
                    </div>
                    <div className="text-[11px] text-[#68736B]">
                      {isHi ? 'फसल लिस्टिंग, स्टॉक व नई फसल जोड़ें' : 'Manage crops, photos & inventory'}
                    </div>
                  </div>
                </div>

                {activeCropsCount > 0 ? (
                  <span className="px-2 py-0.5 rounded-full bg-[#245C3A] text-white text-xs font-bold">
                    {activeCropsCount}
                  </span>
                ) : (
                  <span className="text-gray-400 group-hover:text-[#245C3A] text-sm">→</span>
                )}
              </button>

              {/* 7. 📊 Mandi Rates */}
              <button
                id="menu-item-mandi-rates"
                onClick={() => handleMenuSelect('market-prices')}
                className={`w-full p-3.5 rounded-2xl text-left transition-all flex items-center justify-between group cursor-pointer border ${
                  currentTab === 'market-prices'
                    ? 'bg-[#EEF3E8] border-[#245C3A]/30 text-[#245C3A]'
                    : 'bg-[#FBFAF4] hover:bg-[#EEF3E8] border-[#EEF3E8] text-[#26332B]'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#EEF3E8] text-[#245C3A] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#26332B] group-hover:text-[#245C3A] transition-colors">
                      {isHi ? '📊 मंडी भाव (Mandi Rates)' : '📊 Mandi Rates'}
                    </div>
                    <div className="text-[11px] text-[#68736B]">
                      {isHi ? 'आधिकारिक सरकारी एगमार्कनेट लाइव भाव' : 'Official AGMARKNET & e-NAM live prices'}
                    </div>
                  </div>
                </div>
                <span className="text-gray-400 group-hover:text-[#245C3A] text-sm">→</span>
              </button>

              {/* Secondary Actions: Add Crop Button */}
              <div className="pt-2">
                <button
                  id="menu-quick-add-crop"
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSellModal();
                  }}
                  className="w-full py-3 rounded-2xl bg-[#245C3A] hover:bg-[#1B432B] text-white text-xs font-bold shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <Plus className="w-4 h-4 text-[#D6A63A]" />
                  <span>{navT.sellCrop}</span>
                </button>
              </div>
            </div>

            {/* Menu Drawer Bottom: Account & Navigation Utilities */}
            <div className="p-4 border-t border-[#EEF3E8] bg-[#FBFAF4] space-y-2 shrink-0">
              <PWAInstallButton currentLanguage={currentLanguage} variant="compact" className="w-full justify-center" />

              {onSwitchToBuyer && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onSwitchToBuyer();
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-bold text-[#245C3A] hover:bg-[#EEF3E8] rounded-xl flex items-center gap-2 cursor-pointer bg-white border border-[#EEF3E8]"
                >
                  <ShoppingBag className="w-4 h-4 text-[#245C3A]" />
                  <span>{isHi ? 'खरीदार पोर्टल पर जाएं' : 'Switch to Buyer Marketplace'}</span>
                </button>
              )}

              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-left px-3 py-2 text-xs font-semibold text-[#68736B] hover:text-[#245C3A] hover:bg-[#EEF3E8] rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Home className="w-4 h-4 text-[#245C3A]" />
                <span>{isHi ? 'किसानसेतु मुख्य वेबसाइट' : 'KisanSetu Public Home'}</span>
              </Link>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onLogout();
                }}
                className="w-full text-left px-3 py-2 text-xs font-bold text-[#B86F4B] hover:bg-red-50 rounded-xl flex items-center gap-2 cursor-pointer transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>{navT.signOut}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
