import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  ShieldCheck,
  TrendingUp,
  Users,
  Sparkles,
  Camera,
  MapPin,
  Store,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LanguageCode, TranslationDictionary } from '../types';
import { PWAInstallButton } from './pwa/PWAInstallButton';

interface HeroSectionProps {
  translations: TranslationDictionary;
  currentLanguage?: LanguageCode;
  onGetStarted: () => void;
  onExplore: () => void;
}

interface BannerSlide {
  id: string;
  badgeHi: string;
  badgeEn: string;
  headlineHi: string;
  headlineEn: string;
  subtextHi: string;
  subtextEn: string;
  ctaHi: string;
  ctaEn: string;
  ctaAction: 'get-started' | 'explore';
  image: string;
  fallbackImage: string;
  altText: string;
  cropHighlight?: string;
}

const BANNER_SLIDES: BannerSlide[] = [
  // SLIDE 1 — MAIN KISANSETU VALUE
  {
    id: 'direct-value',
    badgeHi: 'किसान से सीधे खरीदार तक',
    badgeEn: 'Direct Farm-to-Buyer Marketplace',
    headlineHi: 'किसान से सीधे खरीदार तक',
    headlineEn: 'Directly From Farmer to Buyer',
    subtextHi: 'अपनी फसल सीधे सही खरीदार तक पहुँचाएँ। बिना किसी बिचौलिए के पारदर्शी व्यापार।',
    subtextEn: 'Connect your harvest directly with genuine wholesale buyers. Transparent deals with zero middlemen.',
    ctaHi: 'फसल बेचें',
    ctaEn: 'Sell Harvest',
    ctaAction: 'get-started',
    image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/images/indian_farm_landscape.jpg',
    altText: 'Indian farmer proudly standing in a green crop field at sunrise',
  },
  // SLIDE 2 — FOUR MAJOR CROPS
  {
    id: 'four-crops',
    badgeHi: '४ प्रमुख फसलें • समर्पित बाज़ार',
    badgeEn: '4 Major Crops • Dedicated Market',
    headlineHi: 'आपकी फसल, आपका बाज़ार',
    headlineEn: 'Your Harvest, Your Marketplace',
    subtextHi: 'गेहूँ, धान, मक्का और दलहन के लिए सीधा मार्केट कनेक्शन। सत्यापित किस्मों की सीधी बिक्री।',
    subtextEn: 'Direct market connections for Wheat, Rice/Paddy, Maize, and Pulses with verified varieties.',
    ctaHi: 'फसल देखें',
    ctaEn: 'Explore Crops',
    ctaAction: 'explore',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/images/indian_farm_landscape.jpg',
    altText: 'Golden ripe Indian wheat and grain harvest ready for market',
    cropHighlight: 'Wheat • Rice • Maize • Pulses',
  },
  // SLIDE 3 — DIRECT MARKET CONNECTION
  {
    id: 'market-connection',
    badgeHi: 'पारदर्शी डिजिटल ट्रेड',
    badgeEn: 'Transparent Digital Trade',
    headlineHi: 'बीच की अनावश्यक कड़ियाँ कम करें',
    headlineEn: 'Eliminate Unnecessary Middle Layers',
    subtextHi: 'किसान और खरीदार को एक ही डिजिटल मार्केटप्लेस पर जोड़ें। उचित मूल्य और भरोसेमंद सौदे।',
    subtextEn: 'Uniting farmers and buyers directly on a single agricultural platform with fair market rates.',
    ctaHi: 'मार्केटप्लेस देखें',
    ctaEn: 'View Marketplace',
    ctaAction: 'explore',
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/images/crops/chana_pulses.jpg',
    altText: 'Harvested grain sacks and farm produce ready for direct buyer transport',
  },
  // SLIDE 4 — SMART CROP LISTING
  {
    id: 'smart-listing',
    badgeHi: 'कैमरा व एआई जांच',
    badgeEn: 'Camera & AI Verification',
    headlineHi: 'अपनी फसल को बेहतर तरीके से लिस्ट करें',
    headlineEn: 'List Your Harvest with Precision',
    subtextHi: 'कैमरा कैप्चर, गुणवत्ता जानकारी और सरकारी मंडी संदर्भ दर के साथ अपनी फसल दर्ज करें।',
    subtextEn: 'Real-time live camera capture, AI visual quality assessment, and official mandi reference rates.',
    ctaHi: 'फसल जोड़ें',
    ctaEn: 'Add Crop',
    ctaAction: 'get-started',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/images/crops/kabuli_chana.jpg',
    altText: 'Close up inspection of clean golden wheat grains for quality grading',
  },
  // SLIDE 5 — TRUST + LOCATION
  {
    id: 'trust-location',
    badgeHi: 'स्थान व जीपीएस सत्यापन',
    badgeEn: 'GPS Geotagged & Verified',
    headlineHi: 'सही फसल, सही जानकारी, सही कनेक्शन',
    headlineEn: 'Verified Crops, Clear Information, Direct Deals',
    subtextHi: 'किसान, फसल, स्थान और उपलब्धता की स्पष्ट जानकारी खरीदार तक। सीधा संपर्क और सटीक दूरी।',
    subtextEn: 'Clear and transparent information on farm location, crop quantity, and verified quality for buyers.',
    ctaHi: 'शुरू करें',
    ctaEn: 'Get Started',
    ctaAction: 'get-started',
    image: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1600&q=80',
    fallbackImage: '/images/indian_farm_landscape.jpg',
    altText: 'Fertile green agricultural farmland landscape with Indian village horizon',
  },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  translations: t,
  currentLanguage = 'hi',
  onGetStarted,
  onExplore,
}) => {
  const isHi = currentLanguage === 'hi';
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = BANNER_SLIDES.length;

  const goToNextSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlideIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentSlideIndex(index);
  };

  // Auto-slide timer (4.5 seconds per slide)
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      goToNextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, goToNextSlide]);

  // Touch Swipe Handlers for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      goToNextSlide();
    } else if (diff < -50) {
      goToPrevSlide();
    }
    setTouchStartX(null);
  };

  const activeSlide = BANNER_SLIDES[currentSlideIndex];

  const handleCtaClick = (action: 'get-started' | 'explore') => {
    if (action === 'get-started') {
      onGetStarted();
    } else {
      onExplore();
    }
  };

  return (
    <section
      id="hero-section"
      aria-label="KisanSetu Featured Agriculture Highlights"
      className="relative pt-4 pb-12 sm:pt-6 sm:pb-16 overflow-hidden bg-transparent"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 space-y-6">
        {/* ========================================================================= */}
        {/* MAIN HERO AUTO-SLIDING BANNER CONTAINER                                  */}
        {/* ========================================================================= */}
        <div
          className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-[#D5E3CE] shadow-xl bg-[#1B432B] min-h-[440px] sm:min-h-[480px] lg:min-h-[520px] flex flex-col justify-between"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Background Images with AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSlide.id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0 z-0"
            >
              <img
                src={
                  failedImages[activeSlide.id]
                    ? activeSlide.fallbackImage
                    : activeSlide.image
                }
                onError={() => {
                  setFailedImages((prev) => ({ ...prev, [activeSlide.id]: true }));
                }}
                alt={activeSlide.altText}
                referrerPolicy="no-referrer"
                loading="eager"
                className="w-full h-full object-cover object-center filter brightness-[0.75] contrast-[1.05]"
              />

              {/* Sophisticated Agricultural Gradient Overlays */}
              {/* Left dark-green readability vignette */}
              <div
                className="absolute inset-0 bg-gradient-to-r from-[#143321]/95 via-[#143321]/80 to-transparent sm:via-[#143321]/60 lg:to-transparent"
                aria-hidden="true"
              />
              {/* Bottom gradient for text and control contrast */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#0F2418]/90 via-[#0F2418]/40 to-transparent"
                aria-hidden="true"
              />
              {/* Subtle warm amber touch */}
              <div
                className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"
                aria-hidden="true"
              />
            </motion.div>
          </AnimatePresence>

          {/* Top Pill / Slide Category Header */}
          <div className="relative z-10 p-5 sm:p-7 flex items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-semibold shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#D6A63A] animate-pulse" />
              <span>{isHi ? activeSlide.badgeHi : activeSlide.badgeEn}</span>
            </div>

            {/* Quick 4 Crops Tag or Live Indicator */}
            <div className="hidden sm:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#245C3A]/80 backdrop-blur-md border border-[#5F8F45]/40 text-emerald-100 text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#D6A63A]" />
              <span>{isHi ? '१००% सीधा व्यापार' : '100% Direct Trade'}</span>
            </div>
          </div>

          {/* Main Content Area (Headline, Subtext, and CTAs) */}
          <div className="relative z-10 px-5 sm:px-8 lg:px-12 py-4 max-w-2xl text-left space-y-4 sm:space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
                className="space-y-3 sm:space-y-4"
              >
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.18] drop-shadow-md">
                  {isHi ? activeSlide.headlineHi : activeSlide.headlineEn}
                </h1>
                <p className="text-sm sm:text-base lg:text-lg text-emerald-50/90 leading-relaxed font-normal max-w-xl drop-shadow-xs">
                  {isHi ? activeSlide.subtextHi : activeSlide.subtextEn}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                id="hero-banner-primary-cta"
                type="button"
                onClick={() => handleCtaClick(activeSlide.ctaAction)}
                className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 rounded-xl text-sm sm:text-base font-bold text-[#143321] bg-gradient-to-r from-amber-300 to-[#D6A63A] hover:from-amber-200 hover:to-amber-400 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span>{isHi ? activeSlide.ctaHi : activeSlide.ctaEn}</span>
                <ArrowRight className="w-5 h-5 text-[#143321]" />
              </button>

              <button
                id="hero-banner-secondary-cta"
                type="button"
                onClick={onExplore}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3.5 rounded-xl text-sm sm:text-base font-semibold text-white bg-white/15 hover:bg-white/25 border border-white/30 backdrop-blur-md transition-all cursor-pointer"
              >
                <span>{isHi ? 'मार्केटप्लेस देखें' : 'View Marketplace'}</span>
              </button>
            </div>
          </div>

          {/* Bottom Carousel Controls Bar (Arrows, Dots, Progress, Pause/Play) */}
          <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between gap-4 border-t border-white/10 bg-black/30 backdrop-blur-xs">
            {/* Slide Indicator Dots with Progress */}
            <div className="flex items-center gap-2" role="tablist" aria-label="Slides">
              {BANNER_SLIDES.map((slide, idx) => {
                const isActive = idx === currentSlideIndex;
                return (
                  <button
                    key={slide.id}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Slide ${idx + 1}: ${isHi ? slide.headlineHi : slide.headlineEn}`}
                    onClick={() => goToSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer min-w-[10px] ${
                      isActive
                        ? 'w-8 bg-gradient-to-r from-amber-300 to-[#D6A63A] shadow-xs'
                        : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                );
              })}

              {/* Slide Counter */}
              <span className="text-[11px] font-mono font-bold text-white/70 ml-2">
                0{currentSlideIndex + 1} / 0{totalSlides}
              </span>
            </div>

            {/* Play/Pause & Prev/Next Arrows */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Play/Pause Button */}
              <button
                type="button"
                onClick={() => setIsPaused((prev) => !prev)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                title={isPaused ? (isHi ? 'स्लाइडर चलाएं' : 'Play slideshow') : (isHi ? 'स्लाइडर रोकें' : 'Pause slideshow')}
                aria-label={isPaused ? 'Resume auto slide' : 'Pause auto slide'}
              >
                {isPaused ? <Play className="w-3.5 h-3.5 fill-white" /> : <Pause className="w-3.5 h-3.5 fill-white" />}
              </button>

              {/* Prev Button */}
              <button
                id="btn-hero-prev-slide"
                type="button"
                onClick={goToPrevSlide}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 hover:bg-white/30 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title={isHi ? 'पिछली स्लाइड' : 'Previous slide'}
                aria-label="Previous Slide"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Next Button */}
              <button
                id="btn-hero-next-slide"
                type="button"
                onClick={goToNextSlide}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/15 hover:bg-white/30 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer active:scale-95"
                title={isHi ? 'अगली स्लाइड' : 'Next slide'}
                aria-label="Next Slide"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* FOUR ACTIVE CROPS STRIP (Wheat, Rice, Maize, Pulses only)                */}
        {/* ========================================================================= */}
        <div className="p-3.5 sm:p-4 rounded-2xl bg-white border border-[#EEF3E8] shadow-xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-[#26332B]">
            <Store className="w-4 h-4 text-[#245C3A]" />
            <span>{isHi ? 'समर्पित सक्रिय फसलें:' : 'Active KisanSetu Crops:'}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EEF3E8] text-[#245C3A] text-xs font-bold border border-[#D5E3CE]">
              <span>🌾</span>
              <span>{isHi ? 'गेहूं (Wheat)' : 'Wheat'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EEF3E8] text-[#245C3A] text-xs font-bold border border-[#D5E3CE]">
              <span>🍚</span>
              <span>{isHi ? 'धान / चावल (Rice)' : 'Rice / Paddy'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EEF3E8] text-[#245C3A] text-xs font-bold border border-[#D5E3CE]">
              <span>🌽</span>
              <span>{isHi ? 'मक्का (Maize)' : 'Maize'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#EEF3E8] text-[#245C3A] text-xs font-bold border border-[#D5E3CE]">
              <span>🫘</span>
              <span>{isHi ? 'दलहन / चना (Pulses)' : 'Pulses / Chana'}</span>
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* PWA INSTALL & TRUST ASSURANCE BAR                                         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Left: Direct Trade Value Assurance Badges */}
          <div className="md:col-span-8 p-4 rounded-2xl bg-[#FBFAF4] border border-[#E3DCCB] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[#26332B]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#EEF3E8] text-[#245C3A] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[#26332B] leading-tight">
                  {t.hero.directTrade}
                </p>
                <p className="text-[11px] text-[#68736B]">
                  {isHi ? 'शून्य बिचौलिया' : 'Zero middleman'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[#26332B] leading-tight">
                  {t.hero.fairPriceAssurance}
                </p>
                <p className="text-[11px] text-[#68736B]">
                  {isHi ? 'सरकारी मंडी संदर्भ' : 'Official Mandi link'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-[#26332B] leading-tight">
                  {t.hero.verifiedFarmers}
                </p>
                <p className="text-[11px] text-[#68736B]">
                  {isHi ? 'सत्यापित थोक खरीदार' : 'Verified buyers'}
                </p>
              </div>
            </div>
          </div>

          {/* Right: Small PWA Install Button */}
          <div className="md:col-span-4 flex justify-center md:justify-end">
            <PWAInstallButton
              currentLanguage={currentLanguage}
              translations={t}
              variant="home-cta"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
