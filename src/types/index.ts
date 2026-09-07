export type LanguageCode = 'hi' | 'en' | 'pa' | 'hr' | 'te' | 'ta';

export interface LanguageOption {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

export interface NavTranslations {
  home: string;
  about: string;
  tagline: string;
  login: string;
  signUp: string;
  selectLanguage: string;
}

export interface HeroTranslations {
  badge: string;
  headlinePart1: string;
  headlinePart2: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
  verifiedFarmers: string;
  directTrade: string;
  fairPriceAssurance: string;
  farmerTag: string;
  marketUpdateTag: string;
}

export interface TrustBenefitItem {
  id: string;
  iconName: 'wheat' | 'handshake' | 'package' | 'chart';
  title: string;
  description: string;
  tag: string;
}

export interface BenefitsTranslations {
  sectionTitle: string;
  sectionSubtitle: string;
  items: TrustBenefitItem[];
}

export interface StatItem {
  value: string;
  label: string;
  subtext: string;
}

export interface WhyAgrohubTranslations {
  sectionTitle: string;
  sectionSubtitle: string;
  statsNotice: string;
  stats: StatItem[];
  pillars: {
    title: string;
    description: string;
  }[];
}

export interface HowItWorksStep {
  stepNumber: string;
  title: string;
  description: string;
  badge: string;
}

export interface HowItWorksTranslations {
  sectionTitle: string;
  sectionSubtitle: string;
  steps: HowItWorksStep[];
}

export interface AboutPreviewTranslations {
  heading: string;
  description: string;
  learnMoreButton: string;
  commitment1: string;
  commitment2: string;
  commitment3: string;
  aboutModalTitle: string;
  aboutModalContent: string[];
}

export interface CtaTranslations {
  heading: string;
  description: string;
  farmerButton: string;
  buyerButton: string;
  badge: string;
  guaranteeText: string;
}

export interface FooterTranslations {
  brandDescription: string;
  navigationHeading: string;
  portalsHeading: string;
  legalHeading: string;
  home: string;
  about: string;
  contact: string;
  privacy: string;
  terms: string;
  farmerPortal: string;
  buyerPortal: string;
  allRightsReserved: string;
}

export interface AuthModalTranslations {
  loginTitle: string;
  signUpTitle: string;
  farmerOption: string;
  buyerOption: string;
  fullNameLabel: string;
  phoneLabel: string;
  stateLabel: string;
  cropsLabel: string;
  submitFarmer: string;
  submitBuyer: string;
  submitLogin: string;
  alreadyHaveAccount: string;
  needAccount: string;
  close: string;
  demoSuccessFarmer: string;
  demoSuccessBuyer: string;
}

export interface InstallAppTranslations {
  title: string;
  subtitle: string;
  buttonText: string;
  badge: string;
  iosInstructionTitle: string;
  iosInstructionStep: string;
  iosStep1: string;
  iosStep2: string;
  iosStep3: string;
  iosClose: string;
  alreadyInstalled: string;
  browserMenuHint: string;
}

export interface TranslationDictionary {
  nav: NavTranslations;
  hero: HeroTranslations;
  benefits: BenefitsTranslations;
  whyAgrohub: WhyAgrohubTranslations;
  howItWorks: HowItWorksTranslations;
  aboutPreview: AboutPreviewTranslations;
  cta: CtaTranslations;
  footer: FooterTranslations;
  authModal: AuthModalTranslations;
  installApp: InstallAppTranslations;
}
