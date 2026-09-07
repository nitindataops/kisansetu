import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ShoppingCart, 
  Package, 
  MessageSquare, 
  User, 
  ChevronDown, 
  Sprout, 
  Sparkles, 
  RefreshCw,
  LogOut,
  MapPin,
  CheckCircle2,
  SlidersHorizontal,
  Home,
  Store,
  FileSpreadsheet,
  Menu as MenuIcon,
  X,
  Truck,
  TrendingUp,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';
import { BuyerProfile, BuyerTab } from '../../types/buyer';
import { LanguageCode } from '../../types';
import { buyerTranslations } from '../../data/buyerTranslations';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

interface BuyerNavbarProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  activeTab: BuyerTab;
  onSelectTab: (tab: BuyerTab) => void;
  buyerProfile?: BuyerProfile | null;
  cartCount: number;
  onOpenCart: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSwitchToFarmerPortal?: () => void;
  onLogout?: () => void;
  onOpenMobileFilter?: () => void;
  onOpenAiAssistant?: () => void;
  onOpenPostRequirement?: () => void;
  onOpenSmartBuy?: () => void;
}

export const BuyerNavbar: React.FC<BuyerNavbarProps> = ({
  currentLanguage,
  onSelectLanguage,
  activeTab,
  onSelectTab,
  buyerProfile,
  cartCount,
  onOpenCart,
  searchQuery,
  onSearchChange,
  onSwitchToFarmerPortal,
  onLogout,
  onOpenAiAssistant,
  onOpenPostRequirement,
  onOpenSmartBuy,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = buyerTranslations[currentLanguage] || buyerTranslations.en;
  const isHi = currentLanguage === 'hi';

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleNavigate = (tab: BuyerTab) => {
    onSelectTab(tab);
    setIsMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FBFAF4] border-b border-[#E3DCB] shadow-2xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2 sm:gap-4">
          
          {/* 1. Left Brand Emblem */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavigate('home')}
              className="flex items-center gap-2.5 text-left group focus:outline-hidden cursor-pointer"
              title="KisanSetu Marketplace"
            >
              <div className="w-10 h-10 rounded-xl bg-[#245C3A] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1C4B2E] transition-colors relative">
                <Sprout className="w-5 h-5 text-[#EAF3E7]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D6A63A] border-2 border-[#FBFAF4]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-[#245C3A] leading-none">
                    KisanSetu
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#245C3A] bg-[#E2ECD9] px-1.5 py-0.5 rounded-sm border border-[#5F8F45]/30">
                    Buyer
                  </span>
                </div>
                <span className="text-[10.5px] font-medium text-[#68736B] tracking-tight">
                  {t.navbar.brandSub}
                </span>
              </div>
            </button>
          </div>

          {/* 2. Center Search Engine / Search */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#738378]">
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>
              <input
                id="buyer-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  onSearchChange(e.target.value);
                  if (activeTab !== 'browse' && e.target.value.trim().length > 0) {
                    onSelectTab('browse');
                  }
                }}
                placeholder={t.navbar.searchPlaceholder}
                className="w-full pl-9 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 text-xs sm:text-sm bg-white border border-[#D5DDD2] rounded-xl focus:border-[#245C3A] focus:ring-2 focus:ring-[#245C3A]/20 transition-all placeholder:text-[#8D9B91] shadow-2xs"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-xs text-[#8D9B91] hover:text-[#26332B] cursor-pointer"
                  title="Clear search"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* 3. Right Action Items: Home, Cart, Language, Menu */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Home Button */}
            <button
              onClick={() => handleNavigate('home')}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                activeTab === 'home'
                  ? 'bg-[#245C3A] text-white border-[#245C3A]'
                  : 'bg-white text-[#38433C] border-[#D5DDD2] hover:bg-[#EEF3E8]'
              }`}
              title="Go to Marketplace Home"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">{t.navbar.home}</span>
            </button>

            {/* PWA In-App Install Button */}
            <PWAInstallButton currentLanguage={currentLanguage} variant="compact" className="hidden sm:flex" />

            {/* Cart Button with Count Badge */}
            <button
              id="buyer-cart-btn"
              onClick={onOpenCart}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-[#245C3A] bg-[#EEF3E8] hover:bg-[#E2ECD9] border border-[#5F8F45]/30 transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="View Procurement Cart"
            >
              <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              <span className="hidden sm:inline text-xs font-bold">{t.navbar.cart}</span>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#D6A63A] text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center shadow-xs border border-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => onSelectLanguage(currentLanguage === 'en' ? 'hi' : 'en')}
              className="px-2.5 py-2 rounded-xl text-xs font-bold text-[#245C3A] bg-white border border-[#D5DDD2] hover:bg-[#EEF3E8] transition-colors cursor-pointer"
              title="Switch Language"
            >
              {currentLanguage === 'en' ? '🇮🇳 हिन्दी' : '🇬🇧 EN'}
            </button>

            {/* Menu Trigger Button */}
            <div className="relative" ref={menuRef}>
              <button
                id="buyer-menu-btn"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                  isMenuOpen
                    ? 'bg-[#245C3A] text-white border-[#245C3A]'
                    : 'bg-white text-[#26332B] border-[#D5DDD2] hover:border-[#245C3A]'
                }`}
                title="Menu"
              >
                {isMenuOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <MenuIcon className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">{isHi ? 'मेनू' : 'Menu'}</span>
              </button>

              {/* Desktop Menu Dropdown Drawer */}
              {isMenuOpen && (
                <div className="hidden sm:block absolute right-0 mt-2 w-76 bg-white rounded-2xl shadow-2xl border border-[#E3DCB] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden max-h-[85vh] overflow-y-auto">
                  
                  {/* User Profile Header in Menu */}
                  <div className="px-4 py-3 bg-[#FAF7F0] border-b border-[#F0EBE1]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#245C3A] text-white flex items-center justify-center text-sm font-black shadow-2xs shrink-0">
                        {buyerProfile?.name?.trim() ? buyerProfile.name.trim().charAt(0).toUpperCase() : 'B'}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1 text-xs font-black text-[#26332B] truncate">
                          <span className="truncate">{buyerProfile?.name || (isHi ? 'खरीदार प्रोफ़ाइल' : 'Buyer Profile')}</span>
                          {buyerProfile?.verified && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#245C3A] shrink-0" />
                          )}
                        </div>
                        {buyerProfile?.businessName && (
                          <div className="text-[11px] text-[#68736B] truncate">
                            {buyerProfile.businessName}
                          </div>
                        )}
                        {buyerProfile?.id && (
                          <div className="text-[10px] font-mono font-bold text-[#245C3A]">
                            ID: {buyerProfile.id}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Primary Navigation Links */}
                  <div className="py-1">
                    {/* 1. Browse Produce */}
                    <button
                      id="buyer-menu-browse"
                      onClick={() => handleNavigate('browse')}
                      className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        activeTab === 'browse' ? 'bg-[#EEF3E8] text-[#245C3A] font-bold' : 'text-[#26332B] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Store className="w-4 h-4 text-[#245C3A]" />
                        <span className="font-semibold">{isHi ? 'फसलें देखें (Browse Produce)' : 'Browse Produce'}</span>
                      </div>
                    </button>

                    {/* 2. Post Requirement */}
                    <button
                      id="buyer-menu-post-req"
                      onClick={() => {
                        setIsMenuOpen(false);
                        if (onOpenPostRequirement) {
                          onOpenPostRequirement();
                        } else {
                          handleNavigate('procurement');
                        }
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs text-[#26332B] hover:bg-[#FAF7F0] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <FileSpreadsheet className="w-4 h-4 text-[#D6A63A]" />
                        <span className="font-semibold">{isHi ? 'आवश्यकता पोस्ट करें (Post Requirement)' : 'Post Requirement'}</span>
                      </div>
                    </button>

                    {/* 3. Smart Buy */}
                    <button
                      id="buyer-menu-smart-buy"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenSmartBuy?.();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs text-[#26332B] hover:bg-[#FAF7F0] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-[#D6A63A]" />
                        <span className="font-semibold">{isHi ? 'स्मार्ट बाय (Smart Buy)' : 'Smart Buy'}</span>
                      </div>
                    </button>

                    {/* 4. Market Signal */}
                    <button
                      id="buyer-menu-market-signal"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenSmartBuy?.();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs text-[#26332B] hover:bg-[#FAF7F0] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <TrendingUp className="w-4 h-4 text-[#245C3A]" />
                        <span className="font-semibold">{isHi ? 'मार्केट सिग्नल (Market Signal)' : 'Market Signal'}</span>
                      </div>
                    </button>

                    {/* 5. My Orders */}
                    <button
                      id="buyer-menu-orders"
                      onClick={() => handleNavigate('orders')}
                      className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        activeTab === 'orders' ? 'bg-[#EEF3E8] text-[#245C3A] font-bold' : 'text-[#26332B] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Package className="w-4 h-4 text-[#245C3A]" />
                        <span className="font-semibold">{isHi ? 'मेरे ऑर्डर (My Orders)' : 'My Orders'}</span>
                      </div>
                    </button>

                    {/* 6. Order Tracking */}
                    <button
                      id="buyer-menu-tracking"
                      onClick={() => handleNavigate('orders')}
                      className="w-full px-4 py-2.5 text-left text-xs text-[#26332B] hover:bg-[#FAF7F0] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Truck className="w-4 h-4 text-[#245C3A]" />
                        <span className="font-semibold">{isHi ? 'ऑर्डर ट्रैकिंग (Order Tracking)' : 'Order Tracking'}</span>
                      </div>
                    </button>

                    {/* 7. Messages */}
                    <button
                      id="buyer-menu-messages"
                      onClick={() => handleNavigate('messages')}
                      className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        activeTab === 'messages' ? 'bg-[#EEF3E8] text-[#245C3A] font-bold' : 'text-[#26332B] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MessageSquare className="w-4 h-4 text-[#245C3A]" />
                        <span className="font-semibold">{isHi ? 'संदेश (Messages)' : 'Messages'}</span>
                      </div>
                    </button>

                    {/* 8. My Profile */}
                    <button
                      id="buyer-menu-profile"
                      onClick={() => handleNavigate('profile')}
                      className={`w-full px-4 py-2.5 text-left text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        activeTab === 'profile' ? 'bg-[#EEF3E8] text-[#245C3A] font-bold' : 'text-[#26332B] hover:bg-[#FAF7F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="w-4 h-4 text-[#245C3A]" />
                        <span className="font-semibold">{isHi ? 'मेरा प्रोफ़ाइल (My Profile)' : 'My Profile'}</span>
                      </div>
                    </button>

                    {/* AI Assistant */}
                    <button
                      id="buyer-menu-ai"
                      onClick={() => {
                        setIsMenuOpen(false);
                        onOpenAiAssistant?.();
                      }}
                      className="w-full px-4 py-2.5 text-left text-xs text-[#26332B] hover:bg-[#FAF7F0] flex items-center justify-between transition-colors cursor-pointer font-bold"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-sm">🤖</span>
                        <span>{isHi ? 'एआई सहायक और सहायता डेस्क' : 'AI Assistant & Help Desk'}</span>
                      </div>
                    </button>
                  </div>

                  {/* Portal Switching & 9. Logout */}
                  <div className="pt-1.5 border-t border-[#F0EBE1] mt-1">
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#68736B] hover:text-[#245C3A] hover:bg-[#EEF3E8] flex items-center gap-2.5 cursor-pointer"
                    >
                      <Home className="w-4 h-4 text-[#245C3A]" />
                      <span>{isHi ? 'मुख्य वेबसाइट (Public Home)' : 'Public Home Page'}</span>
                    </Link>

                    {onSwitchToFarmerPortal && (
                      <button
                        onClick={() => {
                          setIsMenuOpen(false);
                          onSwitchToFarmerPortal();
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs font-bold text-[#245C3A] hover:bg-[#EEF3E8] flex items-center gap-2.5 cursor-pointer"
                      >
                        <RefreshCw className="w-4 h-4 text-[#D6A63A]" />
                        <span>{t.navbar.switchToFarmer}</span>
                      </button>
                    )}

                    {onLogout && (
                      <button
                        id="buyer-menu-logout"
                        onClick={() => {
                          setIsMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2.5 text-left text-xs text-red-600 hover:bg-red-50 flex items-center gap-2.5 cursor-pointer font-bold"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>{isHi ? 'लॉग आउट (Logout)' : 'Logout'}</span>
                      </button>
                    )}
                  </div>

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>

      {/* 2. MOBILE SLIDE-OVER DRAWER MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMenuOpen(false)}
          />
          {/* Drawer content */}
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-2xl p-5 flex flex-col justify-between animate-in slide-in-from-right duration-200 overflow-y-auto">
            <div className="space-y-4">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#EEF3E8]">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#245C3A] text-white flex items-center justify-center text-sm font-black shadow-2xs shrink-0">
                    {buyerProfile?.name?.trim() ? buyerProfile.name.trim().charAt(0).toUpperCase() : 'B'}
                  </div>
                  <div className="min-w-0">
                    <span className="font-bold text-sm text-[#26332B] truncate block">
                      {buyerProfile?.name || (isHi ? 'खरीदार प्रोफ़ाइल' : 'Buyer Profile')}
                    </span>
                    <span className="text-[10px] text-[#68736B] truncate block">
                      {buyerProfile?.businessName || (isHi ? 'सत्यापित खरीदार' : 'Verified Buyer')}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-1.5 rounded-xl text-gray-500 hover:bg-gray-100 cursor-pointer"
                  title="Close Menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PWA Install Banner inside Mobile Drawer */}
              <PWAInstallButton currentLanguage={currentLanguage} variant="banner" />

              {/* Navigation Links */}
              <div className="space-y-1">
                <button
                  onClick={() => handleNavigate('home')}
                  className={`w-full px-3 py-2 rounded-xl text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                    activeTab === 'home' ? 'bg-[#EEF3E8] text-[#245C3A] font-bold' : 'text-[#26332B] hover:bg-[#FAF7F0]'
                  }`}
                >
                  <Home className="w-4 h-4 text-[#245C3A]" />
                  <span>{isHi ? 'होम (Marketplace Home)' : 'Marketplace Home'}</span>
                </button>

                <button
                  onClick={() => handleNavigate('browse')}
                  className={`w-full px-3 py-2 rounded-xl text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                    activeTab === 'browse' ? 'bg-[#EEF3E8] text-[#245C3A] font-bold' : 'text-[#26332B] hover:bg-[#FAF7F0]'
                  }`}
                >
                  <Store className="w-4 h-4 text-[#245C3A]" />
                  <span>{isHi ? 'फसलें देखें (Browse Produce)' : 'Browse Produce'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenCart();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer text-[#26332B] hover:bg-[#FAF7F0]"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4 text-[#245C3A]" />
                    <span>{isHi ? 'प्रोक्योरमेंट कार्ट (My Cart)' : 'My Cart'}</span>
                  </div>
                  {cartCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#D6A63A] text-white text-[10px] font-black">
                      {cartCount}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => handleNavigate('orders')}
                  className={`w-full px-3 py-2 rounded-xl text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                    activeTab === 'orders' ? 'bg-[#EEF3E8] text-[#245C3A] font-bold' : 'text-[#26332B] hover:bg-[#FAF7F0]'
                  }`}
                >
                  <Package className="w-4 h-4 text-[#245C3A]" />
                  <span>{isHi ? 'मेरे ऑर्डर एवं ट्रैकिंग (My Orders & Tracking)' : 'My Orders & Tracking'}</span>
                </button>

                <button
                  onClick={() => handleNavigate('messages')}
                  className={`w-full px-3 py-2 rounded-xl text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                    activeTab === 'messages' ? 'bg-[#EEF3E8] text-[#245C3A] font-bold' : 'text-[#26332B] hover:bg-[#FAF7F0]'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-[#245C3A]" />
                  <span>{isHi ? 'संदेश (Messages)' : 'Messages'}</span>
                </button>

                <button
                  onClick={() => handleNavigate('profile')}
                  className={`w-full px-3 py-2 rounded-xl text-xs flex items-center gap-3 transition-colors cursor-pointer ${
                    activeTab === 'profile' ? 'bg-[#EEF3E8] text-[#245C3A] font-bold' : 'text-[#26332B] hover:bg-[#FAF7F0]'
                  }`}
                >
                  <User className="w-4 h-4 text-[#245C3A]" />
                  <span>{isHi ? 'मेरा प्रोफ़ाइल (My Profile)' : 'My Profile'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenSmartBuy?.();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs flex items-center gap-3 text-[#26332B] hover:bg-[#FAF7F0] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-[#D6A63A]" />
                  <span>{isHi ? 'स्मार्ट बाय (Smart Buy AI)' : 'Smart Buy AI'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    if (onOpenPostRequirement) {
                      onOpenPostRequirement();
                    } else {
                      handleNavigate('procurement');
                    }
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs flex items-center gap-3 text-[#26332B] hover:bg-[#FAF7F0] cursor-pointer"
                >
                  <FileSpreadsheet className="w-4 h-4 text-[#D6A63A]" />
                  <span>{isHi ? 'आवश्यकता पोस्ट करें (Post Requirement)' : 'Post Requirement'}</span>
                </button>

                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onOpenAiAssistant?.();
                  }}
                  className="w-full px-3 py-2 rounded-xl text-xs flex items-center gap-3 text-[#26332B] hover:bg-[#FAF7F0] font-bold cursor-pointer"
                >
                  <span className="text-sm">🤖</span>
                  <span>{isHi ? 'एआई सहायक और सहायता डेस्क' : 'AI Assistant & Help Desk'}</span>
                </button>
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-[#EEF3E8] space-y-2 mt-4">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="w-full py-2 px-3 rounded-xl bg-[#EEF3E8] text-[#245C3A] text-xs font-bold flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                <span>{isHi ? 'मुख्य वेबसाइट (Public Home)' : 'Public Home Page'}</span>
              </Link>

              {onSwitchToFarmerPortal && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onSwitchToFarmerPortal();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#FAF7F0] text-[#245C3A] border border-[#E3DCB] text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <RefreshCw className="w-4 h-4 text-[#D6A63A]" />
                  <span>{t.navbar.switchToFarmer}</span>
                </button>
              )}

              {onLogout && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onLogout();
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-red-50 text-red-700 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isHi ? 'लॉग आउट (Logout)' : 'Logout'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. MOBILE BOTTOM 5-TAB NAVIGATION (Mobile PWA Navigation) */}
      <nav
        aria-label="Buyer Mobile Navigation"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#D5DDD2] safe-area-bottom shadow-lg"
      >
        <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
          {/* Tab 1: Home */}
          <button
            id="buyer-bottom-nav-home"
            onClick={() => handleNavigate('home')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'home'
                ? 'text-[#245C3A] font-bold'
                : 'text-[#68736B] hover:text-[#26332B]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] leading-none">{t.navbar.home || (isHi ? 'होम' : 'Home')}</span>
          </button>

          {/* Tab 2: Browse */}
          <button
            id="buyer-bottom-nav-browse"
            onClick={() => handleNavigate('browse')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'browse'
                ? 'text-[#245C3A] font-bold'
                : 'text-[#68736B] hover:text-[#26332B]'
            }`}
          >
            <Store className="w-5 h-5" />
            <span className="text-[10px] leading-none">{isHi ? 'ब्राउज़' : (t.navbar.browseProduce?.split(' ')[0] || 'Browse')}</span>
          </button>

          {/* Tab 3: Cart */}
          <button
            id="buyer-bottom-nav-cart"
            onClick={onOpenCart}
            className="relative flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer text-[#68736B] hover:text-[#26332B]"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-[#245C3A]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-[#D6A63A] text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-xs border border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[10px] leading-none">{t.navbar.cart || (isHi ? 'कार्ट' : 'Cart')}</span>
          </button>

          {/* Tab 4: Orders */}
          <button
            id="buyer-bottom-nav-orders"
            onClick={() => handleNavigate('orders')}
            className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              activeTab === 'orders'
                ? 'text-[#245C3A] font-bold'
                : 'text-[#68736B] hover:text-[#26332B]'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[10px] leading-none">{t.navbar.orders || (isHi ? 'ऑर्डर' : 'Orders')}</span>
          </button>

          {/* Tab 5: Menu */}
          <button
            id="buyer-bottom-nav-menu"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={`flex flex-col items-center justify-center gap-1 transition-colors cursor-pointer ${
              isMenuOpen
                ? 'text-[#245C3A] font-bold'
                : 'text-[#68736B] hover:text-[#26332B]'
            }`}
          >
            <MenuIcon className="w-5 h-5" />
            <span className="text-[10px] leading-none">
              {currentLanguage === 'hi' ? 'मेनू' : currentLanguage === 'pa' ? 'ਮੀਨੂ' : currentLanguage === 'te' ? 'మెనూ' : currentLanguage === 'ta' ? 'மெனு' : currentLanguage === 'hr' ? 'मीनू' : 'Menu'}
            </span>
          </button>
        </div>
      </nav>
    </>
  );
};
