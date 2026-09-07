import React, { useState, useEffect } from 'react';
import { Menu, X, Sprout } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { LanguageCode, TranslationDictionary } from '../types';
import { PWAInstallButton } from './pwa/PWAInstallButton';

interface NavbarProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  translations: TranslationDictionary;
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
  onOpenAbout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentLanguage,
  onSelectLanguage,
  translations: t,
  onOpenLogin,
  onOpenSignUp,
  onOpenAbout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <header
      id="main-navbar"
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-[#FBFAF4]/95 backdrop-blur-md shadow-xs border-b border-[#E7E0D0]/90 py-2.5'
          : 'bg-[#FBFAF4]/80 backdrop-blur-md border-b border-[#ECE6D8]/60 py-3.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Left Side: Logo + Tagline */}
          <div className="flex items-center gap-8">
            <button
              id="brand-logo-btn"
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
              aria-label="KisanSetu Home"
            >
              {/* Agricultural Emblem Logo */}
              <div className="w-10 h-10 rounded-xl bg-[#245C3A] flex items-center justify-center text-white shadow-xs group-hover:bg-[#1C4B2E] transition-colors relative">
                <Sprout className="w-5 h-5 text-[#EAF3E7]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D6A63A] border-2 border-[#FBFAF4]" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-[#245C3A] leading-tight">
                    KisanSetu
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6A63A] bg-[#F7EFE0] px-1.5 py-0.2 rounded-sm border border-[#EADBBD]">
                    Agri
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#68736B] tracking-wide">
                  {t.nav.tagline}
                </span>
              </div>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1" aria-label="Main Navigation">
              <button
                id="nav-home-link"
                onClick={() => scrollToSection('home')}
                className="px-3.5 py-1.5 text-sm font-bold text-[#245C3A] relative transition-colors cursor-pointer group"
              >
                <span>{t.nav.home}</span>
                {/* Golden Harvest Underline for Active Nav */}
                <span className="absolute bottom-0 left-3.5 right-3.5 h-[2.5px] bg-[#D6A63A] rounded-full" />
              </button>
              <button
                id="nav-about-link"
                onClick={() => onOpenAbout()}
                className="px-3.5 py-1.5 text-sm font-medium text-[#68736B] hover:text-[#245C3A] rounded-md transition-colors hover:bg-[#EEF3E8]/80 cursor-pointer"
              >
                {t.nav.about}
              </button>
            </nav>
          </div>

          {/* Right Side: Language Selector + Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* PWA In-App Install Button */}
            <PWAInstallButton currentLanguage={currentLanguage} translations={t} variant="navbar" />

            {/* Language Selector */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              onSelectLanguage={onSelectLanguage}
              variant="navbar"
            />

            {/* Login Button: Forest Green Outline */}
            <button
              id="nav-login-btn"
              onClick={onOpenLogin}
              className="px-4 py-2 text-sm font-semibold text-[#245C3A] hover:text-[#1C4B2E] bg-transparent hover:bg-[#EEF3E8] rounded-lg transition-colors border border-[#245C3A] cursor-pointer"
            >
              {t.nav.login}
            </button>

            {/* Sign Up Button: Forest Green filled with Golden Harvest hover glow */}
            <button
              id="nav-signup-btn"
              onClick={onOpenSignUp}
              className="px-4.5 py-2 text-sm font-bold text-white bg-[#245C3A] hover:bg-[#1C4B2E] hover:ring-2 hover:ring-[#D6A63A]/50 rounded-lg shadow-xs hover:shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              {t.nav.signUp}
            </button>
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center gap-1.5 sm:gap-2">
            <PWAInstallButton currentLanguage={currentLanguage} translations={t} variant="compact" />
            <LanguageSelector
              currentLanguage={currentLanguage}
              onSelectLanguage={onSelectLanguage}
              variant="navbar"
              className="mr-1"
            />
            <button
              id="mobile-menu-toggle-btn"
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#245C3A] hover:bg-[#EEF3E8] transition-colors"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer / Menu */}
      {mobileMenuOpen && (
        <div 
          id="mobile-dropdown-menu" 
          className="md:hidden border-t border-[#ECE6D8] bg-[#FBFAF4] px-4 pt-3 pb-6 space-y-4 shadow-md"
        >
          {/* In-Drawer Mobile PWA Banner */}
          <PWAInstallButton currentLanguage={currentLanguage} translations={t} variant="banner" />

          <div className="flex flex-col space-y-1">
            <button
              id="mobile-nav-home"
              onClick={() => scrollToSection('home')}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-bold text-[#245C3A] bg-[#EEF3E8] border-l-4 border-[#D6A63A] transition-colors cursor-pointer"
            >
              {t.nav.home}
            </button>
            <button
              id="mobile-nav-about"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAbout();
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-base font-medium text-[#68736B] hover:text-[#245C3A] hover:bg-[#EEF3E8] transition-colors cursor-pointer"
            >
              {t.nav.about}
            </button>
          </div>

          <div className="pt-2 border-t border-[#E8E1CF] flex flex-col gap-2.5">
            <button
              id="mobile-login-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenLogin();
              }}
              className="w-full py-2.5 text-center text-sm font-semibold text-[#245C3A] border border-[#245C3A] rounded-xl hover:bg-[#EEF3E8] transition-colors cursor-pointer"
            >
              {t.nav.login}
            </button>
            <button
              id="mobile-signup-btn"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSignUp();
              }}
              className="w-full py-2.5 text-center text-sm font-bold text-white bg-[#245C3A] hover:bg-[#1C4B2E] rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              {t.nav.signUp}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
