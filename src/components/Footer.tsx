import React from 'react';
import { Sprout } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { LanguageCode, TranslationDictionary } from '../types';

interface FooterProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  translations: TranslationDictionary;
  onOpenAbout: () => void;
  onOpenContact: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  currentLanguage,
  onSelectLanguage,
  translations: t,
  onOpenAbout,
  onOpenContact,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#183D27]/95 backdrop-blur-md text-[#EEF3E8] border-t border-[#12311F]/80 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-[#245C3A]/60">
          
          {/* Brand Column (2 cols wide on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <button 
              id="footer-brand-btn"
              onClick={scrollToTop}
              className="flex items-center gap-3 text-left group cursor-pointer focus:outline-hidden"
              aria-label="KisanSetu"
            >
              <div className="w-10 h-10 rounded-xl bg-[#245C3A] border border-[#377A52] flex items-center justify-center text-white shadow-xs group-hover:bg-[#2F734A] transition-colors relative">
                <Sprout className="w-5 h-5 text-[#EAF3E7]" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#D6A63A] border-2 border-[#183D27]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
                    KisanSetu
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D6A63A] bg-[#245C3A] px-1.5 py-0.2 rounded-sm border border-[#3A7550]">
                    Agri
                  </span>
                </div>
                <span className="text-[11px] font-medium text-[#A9C4A9] tracking-wide">
                  {t.nav.tagline}
                </span>
              </div>
            </button>
            <p className="text-xs sm:text-sm text-[#B5CEB5] max-w-sm leading-relaxed">
              {t.footer.brandDescription}
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D6A63A]">
              {t.footer.navigationHeading}
            </h4>
            <ul className="space-y-2 text-sm text-[#C4D9C4]">
              <li>
                <button
                  id="footer-home-link"
                  onClick={scrollToTop}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.footer.home}
                </button>
              </li>
              <li>
                <button
                  id="footer-about-link"
                  onClick={onOpenAbout}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.footer.about}
                </button>
              </li>
              <li>
                <button
                  id="footer-contact-link"
                  onClick={onOpenContact}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.footer.contact}
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Language Column */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#D6A63A]">
              {t.footer.legalHeading}
            </h4>
            <ul className="space-y-2 text-sm text-[#C4D9C4] mb-4">
              <li>
                <button
                  id="footer-privacy-link"
                  onClick={onOpenPrivacy}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.footer.privacy}
                </button>
              </li>
              <li>
                <button
                  id="footer-terms-link"
                  onClick={onOpenTerms}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  {t.footer.terms}
                </button>
              </li>
            </ul>

            <div className="pt-1">
              <LanguageSelector
                currentLanguage={currentLanguage}
                onSelectLanguage={onSelectLanguage}
                variant="footer"
              />
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Indian Agriculture Ribbon */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9BB89B]">
          <p>© 2026 KisanSetu. {t.footer.allRightsReserved}</p>
          <div className="flex items-center gap-2">
            <span className="text-[#D6A63A]">🌾</span>
            <span>Empowering Indian Agriculture with Trust & Technology</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
