import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../Navbar';
import { HeroSection } from '../HeroSection';
import { TrustBenefits } from '../TrustBenefits';
import { WhyKisanSetu } from '../WhyKisanSetu';
import { HowItWorks } from '../HowItWorks';
import { AboutPreview } from '../AboutPreview';
import { CTASection } from '../CTASection';
import { Footer } from '../Footer';
import { LivingFarmBackground } from '../LivingFarmBackground';
import { AboutModal } from '../AboutModal';
import { InfoModal } from '../InfoModal';
import { KisanSetuSupportAssistant } from '../support/KisanSetuSupportAssistant';
import { FloatingHelpButton } from '../support/FloatingHelpButton';
import { translations } from '../../data/translations';
import { LanguageCode } from '../../types';
import { FarmerProfile } from '../../types/farmer';
import { BuyerProfile } from '../../types/buyer';
import { getStoredAuthSession } from '../../services/authApiService';

interface LandingPageProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (code: LanguageCode) => void;
  authenticatedRole: 'farmer' | 'buyer' | 'admin' | null;
  farmerProfile?: FarmerProfile;
  buyerProfile?: BuyerProfile;
  onLoginSuccess: (role: 'farmer' | 'buyer' | 'admin', userData?: any) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentLanguage,
  onSelectLanguage,
  authenticatedRole,
  farmerProfile,
  buyerProfile,
  onLoginSuccess,
}) => {
  const navigate = useNavigate();

  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [infoModalType, setInfoModalType] = useState<'contact' | 'privacy' | 'terms' | null>(null);
  const [isSupportAssistantOpen, setIsSupportAssistantOpen] = useState(false);
  const [supportAssistantPrompt, setSupportAssistantPrompt] = useState<string | undefined>(undefined);

  const t = translations[currentLanguage] || translations.en;

  const handleOpenLogin = (role?: 'farmer' | 'buyer') => {
    if (role) {
      navigate(`/login?role=${role}`);
    } else {
      navigate('/login');
    }
  };

  const handleOpenSignUp = (role?: 'farmer' | 'buyer') => {
    if (role) {
      navigate(`/signup?role=${role}`);
    } else {
      navigate('/signup');
    }
  };

  const handleOpenAiAssistant = (initialPrompt?: string) => {
    setSupportAssistantPrompt(initialPrompt);
    setIsSupportAssistantOpen(true);
  };

  // Compute real authenticated user context for AI Support Assistant
  const currentAuthUserContext = useMemo(() => {
    const session = getStoredAuthSession();
    if (authenticatedRole === 'farmer' && farmerProfile) {
      return {
        userId: farmerProfile.id,
        userName: farmerProfile.name,
        userRole: 'farmer' as const,
        userPhone: farmerProfile.contactNumber,
        token: session.token || undefined,
      };
    }
    if (authenticatedRole === 'buyer' && buyerProfile) {
      return {
        userId: buyerProfile.id,
        userName: buyerProfile.name,
        userRole: 'buyer' as const,
        userPhone: buyerProfile.contactNumber,
        token: session.token || undefined,
      };
    }
    return undefined;
  }, [authenticatedRole, farmerProfile, buyerProfile]);

  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#26332B] selection:bg-[#D6A63A]/25 selection:text-[#245C3A] relative">
      {/* Full-Page Realistic Indian Agricultural Environment Background */}
      <LivingFarmBackground />

      {/* Main Responsive Agricultural Navbar */}
      <Navbar
        currentLanguage={currentLanguage}
        onSelectLanguage={onSelectLanguage}
        translations={t}
        onOpenLogin={() => {
          if (authenticatedRole === 'farmer') {
            navigate('/farmer/dashboard');
          } else if (authenticatedRole === 'buyer') {
            navigate('/buyer/dashboard');
          } else if (authenticatedRole === 'admin') {
            navigate('/admin');
          } else {
            handleOpenLogin();
          }
        }}
        onOpenSignUp={() => {
          if (authenticatedRole === 'farmer') {
            navigate('/farmer/dashboard');
          } else if (authenticatedRole === 'buyer') {
            navigate('/buyer/dashboard');
          } else {
            handleOpenSignUp();
          }
        }}
        onOpenAbout={() => setIsAboutModalOpen(true)}
      />

      {/* Main Page Sections */}
      <main id="main-content" className="flex-1 w-full relative z-10">
        {/* 1. Hero Section */}
        <HeroSection
          translations={t}
          currentLanguage={currentLanguage}
          onGetStarted={() => {
            if (authenticatedRole === 'farmer') {
              navigate('/farmer/dashboard');
            } else if (authenticatedRole === 'buyer') {
              navigate('/buyer/dashboard');
            } else {
              handleOpenSignUp();
            }
          }}
          onExplore={() => handleScrollToSection('features-section')}
        />

        {/* 2. Trust / Benefits Section */}
        <TrustBenefits translations={t} />

        {/* 3. Why KisanSetu (Stats + Value Pillars) */}
        <WhyKisanSetu translations={t} />

        {/* 4. How It Works */}
        <HowItWorks
          translations={t}
          onGetStarted={() => {
            if (authenticatedRole === 'farmer') {
              navigate('/farmer/dashboard');
            } else if (authenticatedRole === 'buyer') {
              navigate('/buyer/dashboard');
            } else {
              handleOpenSignUp();
            }
          }}
        />

        {/* 5. About Section Preview */}
        <AboutPreview
          translations={t}
          onOpenAboutModal={() => setIsAboutModalOpen(true)}
        />

        {/* 6. Call To Action */}
        <CTASection
          translations={t}
          onGetStarted={() => {
            if (authenticatedRole === 'farmer') {
              navigate('/farmer/dashboard');
            } else if (authenticatedRole === 'buyer') {
              navigate('/buyer/dashboard');
            } else {
              handleOpenSignUp();
            }
          }}
          onLogin={() => {
            if (authenticatedRole === 'farmer') {
              navigate('/farmer/dashboard');
            } else if (authenticatedRole === 'buyer') {
              navigate('/buyer/dashboard');
            } else {
              handleOpenLogin();
            }
          }}
        />
      </main>

      {/* Agricultural Footer */}
      <Footer
        currentLanguage={currentLanguage}
        onSelectLanguage={onSelectLanguage}
        translations={t}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenContact={() => setInfoModalType('contact')}
        onOpenPrivacy={() => setInfoModalType('privacy')}
        onOpenTerms={() => setInfoModalType('terms')}
      />

      {/* Full About Modal */}
      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        translations={t}
      />

      {/* Info Modals */}
      <InfoModal
        isOpen={infoModalType !== null}
        onClose={() => setInfoModalType(null)}
        type={infoModalType || 'contact'}
        onOpenAiSupport={() => handleOpenAiAssistant()}
      />

      {/* Floating Help Button */}
      <FloatingHelpButton
        currentLanguage={currentLanguage}
        onClick={() => handleOpenAiAssistant()}
      />

      {/* Unified AI Support Assistant Modal */}
      <KisanSetuSupportAssistant
        isOpen={isSupportAssistantOpen}
        onClose={() => setIsSupportAssistantOpen(false)}
        currentLanguage={currentLanguage}
        userContext={currentAuthUserContext}
        initialPrompt={supportAssistantPrompt}
        onNavigateAction={(action, payload) => {
          if (action === 'NAVIGATE_MARKETPLACE') {
            navigate('/buyer/dashboard');
          } else if (action === 'NAVIGATE_ADD_CROP') {
            navigate('/farmer/dashboard');
          } else if (action === 'NAVIGATE_ORDERS') {
            if (authenticatedRole === 'farmer') {
              navigate('/farmer/dashboard');
            } else {
              navigate('/buyer/dashboard');
            }
          } else if (action === 'NAVIGATE_PROPERTY') {
            navigate('/farmer/dashboard');
          } else if (action === 'NAVIGATE_REQUIREMENTS') {
            navigate('/buyer/dashboard');
          } else if (action === 'NAVIGATE_LOGIN') {
            setIsSupportAssistantOpen(false);
            const role = (payload?.role as 'farmer' | 'buyer') || 'farmer';
            navigate(`/login?role=${role}`);
          }
        }}
      />
    </div>
  );
};
