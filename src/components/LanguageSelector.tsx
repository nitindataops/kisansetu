import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { LANGUAGES } from '../data/translations';
import { LanguageCode } from '../types';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  variant?: 'navbar' | 'footer' | 'mobile';
  className?: string;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
  variant = 'navbar',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLang = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: LanguageCode) => {
    onSelectLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        id={`lang-select-btn-${variant}`}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          variant === 'footer'
            ? 'bg-[#245C3A] text-white hover:bg-[#2D7047] border border-[#377A52]'
            : variant === 'mobile'
            ? 'w-full justify-between bg-[#FBFAF4] border border-[#E0D8C7] text-[#26332B] py-2.5 px-4'
            : 'text-[#245C3A] hover:text-[#183D27] bg-[#EEF3E8] hover:bg-[#E2EBD9] border border-[#D5E3CE]'
        }`}
      >
        <span className="flex items-center gap-1.5">
          <Globe className={`w-4 h-4 ${variant === 'footer' ? 'text-[#D6A63A]' : 'text-[#245C3A]'}`} />
          <span>{selectedLang.nativeName}</span>
        </span>
        <ChevronDown className={`w-3.5 h-3.5 ${variant === 'footer' ? 'text-[#C7D9C7]' : 'text-[#68736B]'} transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Select language"
          className={`absolute z-50 mt-1.5 w-48 rounded-xl bg-[#FBFAF4] shadow-xl ring-1 ring-black/5 border border-[#E3DBC8] py-1 text-sm ${
            variant === 'footer' ? 'bottom-full mb-2 left-0' : 'right-0'
          }`}
        >
          {LANGUAGES.map((lang) => {
            const isSelected = lang.code === currentLanguage;
            return (
              <button
                key={lang.code}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(lang.code)}
                className={`w-full flex items-center justify-between px-3.5 py-2 text-left cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-[#EEF3E8] text-[#245C3A] font-bold border-l-3 border-[#D6A63A]'
                    : 'text-[#26332B] hover:bg-[#F3EFE4] hover:text-[#245C3A]'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{lang.nativeName}</span>
                  <span className="text-xs text-[#68736B] font-normal">{lang.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#D6A63A]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
