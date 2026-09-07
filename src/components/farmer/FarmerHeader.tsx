import React from 'react';
import {
  Menu,
  Bell,
  Globe,
  ShieldCheck,
  Search,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { LanguageCode } from '../../types';
import { FarmerDashboardTab } from '../../types/farmer';

interface FarmerHeaderProps {
  farmerName: string;
  onOpenMobileNav: () => void;
  onSelectTab: (tab: FarmerDashboardTab) => void;
  unreadNotifsCount: number;
  currentLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
}

export const FarmerHeader: React.FC<FarmerHeaderProps> = ({
  farmerName,
  onOpenMobileNav,
  onSelectTab,
  unreadNotifsCount,
  currentLanguage,
  onSelectLanguage,
}) => {
  const languages: { code: LanguageCode; label: string }[] = [
    { code: 'hi', label: 'हिंदी' },
    { code: 'en', label: 'English' },
    { code: 'pa', label: 'ਪੰਜਾਬੀ' },
    { code: 'hr', label: 'हरियाणवी' },
    { code: 'te', label: 'తెలుగు' },
    { code: 'ta', label: 'தமிழ்' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-[#FFFFFF]/90 backdrop-blur-md border-b border-[#EEF3E8] px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between transition-all duration-200">
      {/* Left Greeting & Mobile Toggle */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={onOpenMobileNav}
          className="p-2 -ml-2 rounded-xl text-[#245C3A] hover:bg-[#EEF3E8] lg:hidden focus:outline-hidden"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold font-serif text-[#26332B] flex items-center gap-2">
              Good Morning, {farmerName}
              <span className="text-xl sm:text-2xl animate-bounce inline-block origin-bottom-right">
                👋
              </span>
            </h1>

            {/* Farmer Verified Badge */}
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#5F8F45]/15 border border-[#5F8F45]/30 text-[#245C3A] text-xs font-bold shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#5F8F45]" />
              <span>Farmer Verified ✓</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-[#68736B] hidden sm:flex items-center gap-2 mt-0.5">
            <span>Manage your crops, find buyers and get the best value.</span>
            <span className="inline-flex items-center gap-1 text-[#245C3A] font-medium bg-[#EEF3E8] px-2 py-0.5 rounded-md text-[11px]">
              <MapPin className="w-3 h-3 text-[#B86F4B]" />
              Meerut, UP
            </span>
          </p>
        </div>
      </div>

      {/* Right Action Icons & Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Search Jump Trigger */}
        <button
          onClick={() => onSelectTab('search-buyers')}
          className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FBFAF4] border border-[#EEF3E8] hover:border-[#5F8F45]/40 text-xs text-[#68736B] hover:text-[#245C3A] transition-all duration-150 shadow-2xs"
          title="Search verified buyers"
        >
          <Search className="w-3.5 h-3.5 text-[#5F8F45]" />
          <span>Search buyers / mandis...</span>
          <kbd className="px-1.5 py-0.5 text-[10px] font-mono bg-white border border-gray-200 rounded-md text-gray-500">
            ⌘K
          </kbd>
        </button>

        {/* Language Selector Dropdown */}
        <div className="relative group">
          <button
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#FBFAF4] border border-[#EEF3E8] hover:bg-[#EEF3E8] text-xs font-semibold text-[#245C3A] transition-colors"
            title="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#5F8F45]" />
            <span className="uppercase">{currentLanguage}</span>
          </button>

          <div className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-lg border border-[#EEF3E8] py-1.5 hidden group-hover:block z-50 animate-in fade-in-50">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => onSelectLanguage(l.code)}
                className={`w-full text-left px-3 py-1.5 text-xs font-medium flex items-center justify-between hover:bg-[#EEF3E8] ${
                  currentLanguage === l.code
                    ? 'text-[#245C3A] font-bold bg-[#EEF3E8]/60'
                    : 'text-[#26332B]'
                }`}
              >
                <span>{l.label}</span>
                {currentLanguage === l.code && <span className="text-[#5F8F45]">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Notifications Icon with Badge */}
        <button
          id="header-notif-btn"
          onClick={() => onSelectTab('notifications')}
          className="relative p-2 rounded-xl bg-[#FBFAF4] border border-[#EEF3E8] hover:bg-[#EEF3E8] text-[#245C3A] transition-colors"
          title="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-[#245C3A]" />
          {unreadNotifsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#B86F4B] text-white text-[10px] font-black flex items-center justify-center animate-pulse">
              {unreadNotifsCount}
            </span>
          )}
        </button>

        {/* Profile Avatar Clickable */}
        <button
          onClick={() => onSelectTab('profile')}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl bg-[#FBFAF4] hover:bg-[#EEF3E8] border border-[#EEF3E8] transition-colors"
          title="View Farmer Profile"
        >
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-linear-to-tr from-[#245C3A] to-[#5F8F45] text-white font-bold text-xs flex items-center justify-center shadow-2xs">
            {farmerName
              ? farmerName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()
              : 'KS'}
          </div>
          <div className="hidden xl:block text-left">
            <span className="block text-xs font-bold text-[#26332B] leading-none">{farmerName || 'Farmer'}</span>
            <span className="text-[10px] text-[#5F8F45] font-medium leading-none">Verified</span>
          </div>
        </button>
      </div>
    </header>
  );
};
