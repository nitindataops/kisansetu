import { LanguageCode } from '../types';

export interface FarmerTranslationDict {
  // Navigation & Menu
  nav: {
    brandSubtitle: string;
    home: string;
    myCrops: string;
    sellCrop: string;
    findBuyers: string;
    marketPrices: string;
    aiAnalysis: string;
    voiceAssistant: string;
    orders: string;
    enquiries: string;
    profile: string;
    notifications: string;
    storageProcessing: string;
    searchPlaceholder: string;
    searchBtn: string;
    signOut: string;
    eKycVerified: string;
    menu: string;
    language: string;
  };

  // Home Dashboard
  home: {
    greetingMorning: string;
    greetingAfternoon: string;
    greetingEvening: string;
    welcomeSub: string;
    quickStats: {
      myCrops: string;
      totalAvailable: string;
      activeOrders: string;
      verifiedRate: string;
    };
    quickActions: {
      title: string;
      addCrop: string;
      addCropSub: string;
      findBuyer: string;
      findBuyerSub: string;
      aiAnalysis: string;
      aiAnalysisSub: string;
      voiceAssistant: string;
      voiceAssistantSub: string;
    };
    categories: {
      all: string;
      wheat: string;
      rice: string;
      maize: string;
      pulses: string;
    };
    sections: {
      myCropsTitle: string;
      myCropsSub: string;
      viewAll: string;
      matchedBuyersTitle: string;
      matchedBuyersSub: string;
      marketPricesTitle: string;
      marketPricesSub: string;
      recentOrderTitle: string;
      recentOrderSub: string;
      aiRecommendationTitle: string;
      trackOrder: string;
    };
    cropCard: {
      grade: string;
      mandiRate: string;
      expectedRate: string;
      available: string;
      sellNow: string;
      edit: string;
      viewDetails: string;
      verifiedLot: string;
      unitKg: string;
      unitQuintal: string;
    };
    buyerCard: {
      verified: string;
      required: string;
      offeredRate: string;
      distance: string;
      match: string;
      makeOffer: string;
      contact: string;
      escrowProtected: string;
    };
  };

  // My Crops View
  myCropsView: {
    title: string;
    subtitle: string;
    addNewCropBtn: string;
    allCrops: string;
    availableForSale: string;
    inNegotiation: string;
    soldLots: string;
    totalStock: string;
    expectedValue: string;
    editListing: string;
    deleteListing: string;
    confirmDelete: string;
    noCropsFound: string;
    showing: string;
    cropsListed: string;
    harvestDate: string;
    moistureContent: string;
    delete: string;
  };

  // Sell / Add Crop Modal
  addCropModal: {
    title: string;
    subtitle: string;
    cropNameLabel: string;
    varietyLabel: string;
    categoryLabel: string;
    quantityLabel: string;
    gradeLabel: string;
    expectedPriceLabel: string;
    mandiPriceLabel: string;
    photoLabel: string;
    publishBtn: string;
    modalTitleNew: string;
    modalTitleEdit: string;
    cropNamePlaceholder: string;
    varietyPlaceholder: string;
    quantityPlaceholder: string;
    harvestDateLabel: string;
    locationLabel: string;
    storageLocationLabel: string;
    descriptionLabel: string;
    descriptionPlaceholder: string;
    photoUploadTitle: string;
    photoUploadHint: string;
    cancelBtn: string;
    submitBtnNew: string;
    submitBtnEdit: string;
    successMessage: string;
  };

  // Search Buyers View
  searchBuyersView: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    filterByCrop: string;
    availableBuyers: string;
    noBuyersFound: string;
    away: string;
    quantityNeeded: string;
    pickupFacility: string;
    farmPickupAvailable: string;
    makeOfferBtn: string;
    contactBtn: string;
  };

  // Market Prices View
  marketPricesView: {
    title: string;
    subtitle: string;
    liveMandiPrices: string;
    actualVsProjectedNotice: string;
    actualMandiBadge: string;
    projectedBadge: string;
    searchCropPlaceholder: string;
    filterMandi: string;
    nearestMandiLabel: string;
    lastUpdated: string;
    trendUp: string;
    trendDown: string;
    trendStable: string;
    viewPriceHistory: string;
    demandVeryHigh: string;
    demandHigh: string;
    demandModerate: string;
    todayMin: string;
    modalAverage: string;
    todayMax: string;
    currentMarketPrice: string;
    historicalTrend: string;
    priceUnavailable: string;
    historyUnavailable: string;
    demoBadge: string;
    priceAlertsHeading: string;
    priceAlertSub: string;
    smsAlertActivated: string;
    targetPriceLabel: string;
    setAlertBtn: string;
    officialGovSource: string;
    dmiAttribution: string;
    arrivalDateLabel: string;
    quintalUnit: string;
    perKgUnit: string;
    ratePerQuintal: string;
    ratePerKg: string;
    stateSelectLabel: string;
    districtSelectLabel: string;
    mandiSelectLabel: string;
    commoditySelectLabel: string;
    varietySelectLabel: string;
    allOption: string;
    searchMandiBtn: string;
    officialMode: string;
    demoMode: string;
    modeToggleLabel: string;
    multiMandiCompareTitle: string;
    multiMandiCompareSub: string;
    nearestMandiBadge: string;
    highestRateBadge: string;
    averageRateAcrossMandis: string;
    noOfficialRecordsFound: string;
    officialRecordsFound: string;
    liveApiActive: string;
    officialSnapshotActive: string;
    mandiDataUnavailable: string;
    mandiCompareUnavailable: string;
    mandiHistoryUnavailable: string;
    singleRecordAvailable: string;
    showingGovRecordsPrefix: string;
    showingGovRecordsSuffix: string;
    showingAllGovRecords: string;
    arrivalDatesGovReported: string;
    officialGovMandiDataBadge: string;
    apiProvenanceLabel: string;
    dataDateLabel: string;
    lastFetchLabel: string;
  };

  // AI Analysis View
  aiAnalysisView: {
    title: string;
    subtitle: string;
    badge: string;
    selectCropPrompt: string;
    currentCropAnalysis: string;
    marketStateHeading: string;
    calculatedEstimateTag: string;
    actualMandiTag: string;
    projectedTrendTag: string;
    optionASellNow: string;
    optionBColdStorage: string;
    optionCProcessMill: string;
    recommendedDecision: string;
    recommendedBadge: string;
    netRealization: string;
    timeline: string;
    riskLevel: string;
    lowRisk: string;
    mediumRisk: string;
    highRisk: string;
    grossRevenue: string;
    transportCost: string;
    storageCost: string;
    processingCost: string;
    actionAcceptOffer: string;
    actionBookStorage: string;
    actionContactProcessor: string;
    aiExplanationHeading: string;
  };

  // Voice Assistant View
  voiceAssistantView: {
    title: string;
    subtitle: string;
    listeningStatus: string;
    idleStatus: string;
    speakingStatus: string;
    tapToSpeakBtn: string;
    stopListeningBtn: string;
    quickPromptsHeading: string;
    prompt1: string;
    prompt2: string;
    prompt3: string;
    prompt4: string;
    prompt5: string;
    voiceFeedbackWelcome: string;
    transcriptHeading: string;
    aiResponseHeading: string;
    actionExecuted: string;
  };

  // Orders View
  ordersView: {
    title: string;
    subtitle: string;
    activeOrdersTab: string;
    completedOrdersTab: string;
    orderNo: string;
    buyer: string;
    cropAndLot: string;
    rate: string;
    totalAmount: string;
    orderDate: string;
    pickupSchedule: string;
    status: string;
    trackVehicle: string;
    callDriver: string;
    escrowStatus: string;
    offerSubmitted: string;
    pickupScheduled: string;
    inTransit: string;
    delivered: string;
    paymentCompleted: string;
    noOrdersFound: string;
    assignedDriver: string;
    viewReceiptBtn: string;
    steps: {
      step1: string;
      step2: string;
      step3: string;
      step4: string;
      step5: string;
      step6: string;
      step7: string;
    };
  };

  // Enquiries View
  enquiriesView: {
    title: string;
    subtitle: string;
    newBadge: string;
    counteredBadge: string;
    acceptedBadge: string;
    declinedBadge: string;
    offeredRate: string;
    yourRate: string;
    acceptBtn: string;
    counterBtn: string;
    declineBtn: string;
    enterCounterPrice: string;
    sendCounter: string;
    noEnquiries: string;
    noEnquiriesFound: string;
    quantity: string;
    acceptBidBtn: string;
    counterRateBtn: string;
    submitCounterBtn: string;
  };

  // Notifications View
  notificationsView: {
    title: string;
    subtitle: string;
    markAllRead: string;
    markAllReadBtn: string;
    viewTabBtn: string;
    emptyNotifications: string;
    noNotifications: string;
  };

  // Profile View
  profileView: {
    title: string;
    subtitle: string;
    kisanId: string;
    contactInfo: string;
    farmDetails: string;
    eKycStatus: string;
    kccStatus: string;
    soilHealthCard: string;
    landArea: string;
    landType: string;
    primaryCrops: string;
    memberSince: string;
    switchAccount: string;
    farmLandTitle: string;
    bankDetailsTitle: string;
    totalLandArea: string;
    soilType: string;
    irrigationSource: string;
    bankName: string;
    accountNumber: string;
    ifscCode: string;
    payoutMode: string;
  };

  // Common UI words
  common: {
    rupeeSymbol: string;
    kg: string;
    quintal: string;
    kmAway: string;
    verifiedBadge: string;
    close: string;
    save: string;
    back: string;
    loading: string;
    or: string;
    all: string;
    today: string;
    cancel: string;
  };
}

// 1. PRIMARY: HINDI (हिंदी)
const hi: FarmerTranslationDict = {
  nav: {
    brandSubtitle: 'किसान मार्केटप्लेस',
    home: 'होम',
    myCrops: 'मेरी फसलें',
    sellCrop: 'फसल बेचें',
    findBuyers: 'खरीदार खोजें',
    marketPrices: 'मंडी भाव',
    aiAnalysis: 'एआई विश्लेषण',
    voiceAssistant: 'वॉयस असिस्टेंट',
    orders: 'ऑर्डर्स',
    enquiries: 'पूछताछ',
    profile: 'प्रोफ़ाइल',
    notifications: 'सूचनाएं',
    storageProcessing: 'स्टोरेज व मिल',
    searchPlaceholder: 'फसल, किस्म या खरीदार खोजें...',
    searchBtn: 'खोजें',
    signOut: 'लॉग आउट / खाता बदलें',
    eKycVerified: 'ई-केवाईसी सत्यापित',
    menu: 'मेनू',
    language: 'भाषा',
  },
  home: {
    greetingMorning: 'नमस्ते, {name} जी! 🌾',
    greetingAfternoon: 'नमस्ते, {name} जी! 🌾',
    greetingEvening: 'शुभ संध्या, {name} जी! 🌾',
    welcomeSub: 'किसानसेतु किसान पोर्टल पर आपका स्वागत है। यहां आपकी फसलों की सूची, आज के मंडी भाव और खरीदारों के सीधे ऑफर उपलब्ध हैं।',
    quickStats: {
      myCrops: 'मेरी फसलें',
      totalAvailable: 'कुल उपलब्ध स्टॉक',
      activeOrders: 'सक्रिय ऑर्डर',
      verifiedRate: 'औसत मंडी भाव',
    },
    quickActions: {
      title: 'त्वरित कार्य',
      addCrop: 'फसल बेचें / जोड़ें',
      addCropSub: 'नई फसल और फोटो जोड़ें',
      findBuyer: 'खरीदार खोजें',
      findBuyerSub: 'मिल और रिटेल खरीदार',
      aiAnalysis: 'एआई फसल विश्लेषण',
      aiAnalysisSub: 'अभी बेचें या रोककर लाभ पाएं',
      voiceAssistant: 'वॉयस असिस्टेंट',
      voiceAssistantSub: 'बोलकर भाव और खरीदार जानें',
    },
    categories: {
      all: 'सभी फसलें',
      wheat: 'गेहूं',
      rice: 'धान / चावल',
      maize: 'मक्का',
      pulses: 'दालें / चना',
    },
    sections: {
      myCropsTitle: 'बिक्री के लिए मेरी फसलें',
      myCropsSub: 'किसानसेतु मार्केटप्लेस पर आपकी सक्रिय फसल लॉट',
      viewAll: 'सभी देखें',
      matchedBuyersTitle: 'सीधे सत्यापित खरीदार',
      matchedBuyersSub: 'आपकी फसल के लिए सबसे अच्छा दाम देने वाले सत्यापित खरीदार',
      marketPricesTitle: 'आज के लाइव मंडी भाव',
      marketPricesSub: 'निकटतम एपीएमसी मंडियों के ताजा भाव',
      recentOrderTitle: 'हाल का ऑर्डर एवं पिकअप',
      recentOrderSub: 'गाड़ी ट्रैकिंग एवं सीधा बैंक भुगतान',
      aiRecommendationTitle: 'एआई फसल बिक्री सलाह',
      trackOrder: 'ऑर्डर ट्रैक करें',
    },
    cropCard: {
      grade: 'ग्रेड',
      mandiRate: 'मंडी भाव',
      expectedRate: 'मेरा भाव',
      available: 'उपलब्ध',
      sellNow: 'खरीदार को बेचें',
      edit: 'बदलाव करें',
      viewDetails: 'विवरण देखें',
      verifiedLot: 'सत्यापित लॉट',
      unitKg: 'किलो',
      unitQuintal: 'क्विंटल',
    },
    buyerCard: {
      verified: 'सत्यापित खरीदार',
      required: 'मांग',
      offeredRate: 'ऑफर भाव',
      distance: 'दूरी',
      match: 'मैच',
      makeOffer: 'ऑफर भेजें',
      contact: 'संपर्क करें',
      escrowProtected: 'सुरक्षित एस्क्रो भुगतान',
    },
  },
  myCropsView: {
    title: 'मेरी फसलें इन्वेंट्री',
    subtitle: 'अपनी फसलों की लिस्टिंग प्रबंधित करें, अपेक्षित भाव तय करें और सीधे खरीदारों से जुड़ें।',
    addNewCropBtn: '+ फसल बेचें / जोड़ें',
    allCrops: 'सभी फसलें',
    availableForSale: 'बिक्री के लिए उपलब्ध',
    inNegotiation: 'बातचीत जारी',
    soldLots: 'बिक चुकी फसलें',
    totalStock: 'कुल स्टॉक',
    expectedValue: 'अपेक्षित कुल मूल्य',
    editListing: 'फसल संपादित करें',
    deleteListing: 'फसल हटाएं',
    confirmDelete: 'क्या आप वाकई इस फसल को अपनी लिस्टिंग से हटाना चाहते हैं?',
    noCropsFound: 'अभी कोई फसल लिस्ट नहीं है। पहली फसल जोड़ने के लिए "+ फसल बेचें" पर क्लिक करें।',
    showing: 'दिखा रहे हैं',
    cropsListed: 'फसलें लिस्टेड',
    harvestDate: 'कटाई की तारीख',
    moistureContent: 'नमी (Moisture)',
    delete: 'हटाएं',
  },
  addCropModal: {
    title: 'नई फसल बिक्री के लिए जोड़ें',
    subtitle: 'अपनी फसल की गुणवत्ता, फोटो और अपेक्षित विक्रय मूल्य दर्ज करें।',
    cropNameLabel: 'फसल का नाम',
    varietyLabel: 'किस्म (वैरायटी)',
    categoryLabel: 'श्रेणी',
    quantityLabel: 'मात्रा (किलो में)',
    gradeLabel: 'गुणवत्ता ग्रेड',
    expectedPriceLabel: 'आपका विक्रय भाव (₹/किलो)',
    mandiPriceLabel: 'वर्तमान मंडी भाव (₹/किलो)',
    photoLabel: 'फसल की फोटो चुनें',
    publishBtn: 'फसल बिक्री के लिए प्रकाशित करें',
    modalTitleNew: 'नई फसल लिस्ट करें',
    modalTitleEdit: 'फसल विवरण बदलें',
    cropNamePlaceholder: 'उदा. टमाटर, शरबती गेहूं, बासमती धान',
    varietyPlaceholder: 'उदा. हाइब्रिड हिमसोना, लोकवान, पूसा ११२१',
    quantityPlaceholder: 'उदा. १५००',
    harvestDateLabel: 'कटाई की तारीख',
    locationLabel: 'खेत का स्थान / गांव',
    storageLocationLabel: 'भंडारण स्थान',
    descriptionLabel: 'गुणवत्ता व भंडारण विवरण',
    descriptionPlaceholder: 'उदा. अच्छी तरह छांटी गई फसल, नमी १२% से कम',
    photoUploadTitle: 'फसल की फोटो',
    photoUploadHint: 'प्रमाणित फोटो में से चुनें या नई फोटो अपलोड करें',
    cancelBtn: 'रद्द करें',
    submitBtnNew: 'मार्केटप्लेस पर प्रकाशित करें',
    submitBtnEdit: 'बदलाव सुरक्षित करें',
    successMessage: 'फसल सफलतापूर्वक किसानसेतु पर प्रकाशित हो गई!',
  },
  searchBuyersView: {
    title: 'सत्यापित खरीदार खोजें 🌾',
    subtitle: 'फूड प्रोसेसर, बड़ी मिलों और खुदरा खरीदारों से सीधे जुड़ें और बिना बिचौलिए के सही दाम पाएं।',
    searchPlaceholder: 'फसल, किस्म या खरीदार खोजें (उदा. मदर डेयरी, गेहूं)...',
    filterByCrop: 'फसल अनुसार फिल्टर',
    availableBuyers: 'उपलब्ध सत्यापित खरीदार',
    noBuyersFound: 'आपकी खोज के अनुसार कोई खरीदार नहीं मिला। कृपया दूसरी फसल का नाम खोजें।',
    away: 'दूर',
    quantityNeeded: 'आवश्यक मात्रा',
    pickupFacility: 'पिकअप सुविधा',
    farmPickupAvailable: 'खेत से सीधी उठान उपलब्ध',
    makeOfferBtn: 'ऑफर / बोली भेजें',
    contactBtn: 'खरीदार को कॉल करें',
  },
  marketPricesView: {
    title: 'आधिकारिक एगमार्कनेट (AGMARKNET) मंडी भाव व रुझान',
    subtitle: 'विपणन एवं निरीक्षण निदेशालय (DMI), कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार द्वारा सत्यापित दैनिक मंडी बुलेटिन।',
    liveMandiPrices: 'सरकारी मंडी भाव बुलेटिन',
    actualVsProjectedNotice: 'सभी भाव आधिकारिक एगमार्कनेट / राज्य एपीएमसी रिकॉर्ड पर आधारित हैं।',
    actualMandiBadge: 'आधिकारिक एगमार्कनेट रिकॉर्ड',
    projectedBadge: 'बाजार रुझान',
    searchCropPlaceholder: 'आधिकारिक मंडी भाव खोजें (उदा. बरेली, मक्का, गेहूं)...',
    filterMandi: 'मंडी चुनें',
    nearestMandiLabel: 'एपीएमसी यार्ड व जिला',
    lastUpdated: 'आधिकारिक मंडी बुलेटिन',
    trendUp: 'भाव बढ़ रहा है',
    trendDown: 'भाव गिर रहा है',
    trendStable: 'भाव स्थिर है',
    viewPriceHistory: '७ दिनों का इतिहास देखें',
    demandVeryHigh: 'अत्यधिक आवक व मांग',
    demandHigh: 'उच्च आवक व मांग',
    demandModerate: 'सामान्य आवक व मांग',
    todayMin: 'आज का न्यूनतम',
    modalAverage: 'मॉडल दर',
    todayMax: 'आज का अधिकतम',
    currentMarketPrice: 'नवीनतम मॉडल दर',
    historicalTrend: '७ दिनों का मूल्य रुझान',
    priceUnavailable: 'इस तिथि के लिए आधिकारिक डेटा दर्ज नहीं है',
    historyUnavailable: '७ दिनों का आधिकारिक मूल्य इतिहास वर्तमान में उपलब्ध नहीं है।',
    demoBadge: 'डेमो / निर्देशात्मक डेटा',
    priceAlertsHeading: 'एसएमएस / व्हाट्सएप मूल्य अलर्ट',
    priceAlertSub: 'जब मंडी में आपकी मनपसंद कीमत पहुंचे तो तुरंत एसएमएस अलर्ट पाएं।',
    smsAlertActivated: 'अलर्ट सेट हो गया! भाव मैच होने पर एसएमएस मिलेगा।',
    targetPriceLabel: 'लक्षित भाव (₹/किलो)',
    setAlertBtn: 'मूल्य अलर्ट सेट करें',
    officialGovSource: 'आधिकारिक स्रोत: एगमार्कनेट (agmarknet.gov.in)',
    dmiAttribution: 'विपणन एवं निरीक्षण निदेशालय, कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार',
    arrivalDateLabel: 'आवक तिथि',
    quintalUnit: '₹/क्विंटल',
    perKgUnit: '₹/किलो',
    ratePerQuintal: 'दर (₹/क्विंटल)',
    ratePerKg: 'दर (₹/किलो)',
    stateSelectLabel: 'राज्य',
    districtSelectLabel: 'जिला',
    mandiSelectLabel: 'मंडी (बाजार)',
    commoditySelectLabel: 'फसल (कमोडिटी)',
    varietySelectLabel: 'किस्म (वैरायटी)',
    allOption: 'सभी',
    searchMandiBtn: 'आधिकारिक मंडी डेटा खोजें',
    officialMode: 'आधिकारिक एगमार्कनेट डेटा',
    demoMode: 'डेमो मार्केट डेटा',
    modeToggleLabel: 'डेटा स्रोत मोड:',
    multiMandiCompareTitle: 'मल्टी-मंडी भाव तुलना',
    multiMandiCompareSub: 'अपनी फसल के लिए सबसे अच्छा बाजार चुनने हेतु आसपास के जिलों के मॉडल भावों की तुलना करें।',
    nearestMandiBadge: 'निकटतम मंडी',
    highestRateBadge: 'सर्वोत्तम भाव वाली मंडी',
    averageRateAcrossMandis: 'सभी मंडियों का औसत मॉडल भाव',
    noOfficialRecordsFound: 'चुने गए फिल्टर से कोई आधिकारिक रिकॉर्ड नहीं मिला। कृपया "सभी" चुनें या दूसरी फसल खोजें।',
    officialRecordsFound: 'आधिकारिक सरकारी मंडी रिकॉर्ड प्राप्त हुए',
    liveApiActive: 'लाइव एगमार्कनेट एपीआई कनेक्टेड',
    officialSnapshotActive: 'आधिकारिक एगमार्कनेट सत्यापित बुलेटिन',
    mandiDataUnavailable: 'आधिकारिक सरकारी मंडी डेटा अस्थायी रूप से अनुपलब्ध है',
    mandiCompareUnavailable: 'सरकारी मंडी तुलना डेटा वर्तमान में उपलब्ध नहीं है।',
    mandiHistoryUnavailable: 'ऐतिहासिक सरकारी डेटा वर्तमान में उपलब्ध नहीं है।',
    singleRecordAvailable: 'इस चयन के लिए केवल 1 सत्यापित सरकारी मूल्य रिकॉर्ड उपलब्ध है।',
    showingGovRecordsPrefix: 'पिछले 7 दिनों की विंडो में उपलब्ध',
    showingGovRecordsSuffix: 'वास्तविक सरकारी मंडी रिकॉर्ड दिखाए जा रहे हैं।',
    showingAllGovRecords: 'पिछले 7 दिनों में उपलब्ध सभी 7 वास्तविक सरकारी मंडी रिकॉर्ड दिखाए जा रहे हैं।',
    arrivalDatesGovReported: 'आवक तिथियां सरकारी रिपोर्ट पर आधारित हैं।',
    officialGovMandiDataBadge: 'आधिकारिक सरकारी मंडी डेटा',
    apiProvenanceLabel: 'स्रोत: भारत सरकार — एगमार्कनेट (AGMARKNET)',
    dataDateLabel: 'डेटा तिथि',
    lastFetchLabel: 'अंतिम सफल एपीआई फेच',
  },
  aiAnalysisView: {
    title: 'एआई फसल बिक्री निर्णय इंजन',
    subtitle: 'शुद्ध मुनाफे की तुलना: अभी बेचें vs कोल्ड स्टोरेज vs मिल में प्रोसेसिंग।',
    badge: 'किसानसेतु किसान बुद्धिमत्ता',
    selectCropPrompt: 'विश्लेषण के लिए फसल चुनें:',
    currentCropAnalysis: 'चुनी गई फसल का विश्लेषण',
    marketStateHeading: 'बाजार की वर्तमान स्थिति',
    calculatedEstimateTag: 'अनुमानित शुद्ध मुनाफा',
    actualMandiTag: 'वास्तविक मंडी भाव',
    projectedTrendTag: '३० दिनों का रुझान',
    optionASellNow: 'विकल्प A: अभी बेचें (सीधा खरीदार)',
    optionBColdStorage: 'विकल्प B: कोल्ड स्टोरेज में रखें',
    optionCProcessMill: 'विकल्प C: पार्टनर मिल में प्रोसेसिंग',
    recommendedDecision: 'अनुशंसित निर्णय',
    recommendedBadge: 'एआई द्वारा सर्वश्रेष्ठ रणनीति',
    netRealization: 'अनुमानित शुद्ध प्राप्ति (Net Realization)',
    timeline: 'भुगतान की समयसीमा',
    riskLevel: 'जोखिम का स्तर',
    lowRisk: 'कम जोखिम',
    mediumRisk: 'मध्यम जोखिम',
    highRisk: 'उच्च जोखिम',
    grossRevenue: 'कुल बिक्री मूल्य',
    transportCost: 'परिवहन / ढुलाई खर्च',
    storageCost: 'भंडारण किराया',
    processingCost: 'प्रोसेसिंग शुल्क',
    actionAcceptOffer: 'शीर्ष खरीदार को बेचें',
    actionBookStorage: 'कोल्ड स्टोरेज बुक करें',
    actionContactProcessor: 'प्रोसेसिंग मिल से जुड़ें',
    aiExplanationHeading: 'यह निर्णय आपके लिए सबसे फायदेमंद क्यों है?',
  },
  voiceAssistantView: {
    title: '🎙️ किसान वॉयस असिस्टेंट',
    subtitle: 'मंडी भाव जानने, खरीदार ढूंढने या फसल बेचने के लिए हिन्दी या अंग्रेजी में बोलें।',
    listeningStatus: 'आपकी आवाज सुन रहे हैं... अब बोलें',
    idleStatus: 'हिन्दी या अंग्रेजी में बोलने के लिए माइक पर टैप करें',
    speakingStatus: 'असिस्टेंट उत्तर दे रहा है...',
    tapToSpeakBtn: 'माइक दबाकर बोलें',
    stopListeningBtn: 'सुनना बंद करें',
    quickPromptsHeading: 'त्वरित वॉयस कमांड्स:',
    prompt1: 'आज मेरठ मंडी में टमाटर का क्या भाव है?',
    prompt2: 'मेरे गेहूं के लिए अच्छे खरीदार खोजें',
    prompt3: 'बिक्री के लिए नई फसल का फॉर्म खोलें',
    prompt4: 'एआई फसल बिक्री सलाह दिखाएं',
    prompt5: 'मेरे ऑर्डर की पिकअप गाड़ी कहां पहुंची?',
    voiceFeedbackWelcome: 'नमस्ते! मैं आपका किसान वॉयस असिस्टेंट हूं। माइक दबाकर मंडी भाव, खरीदार या ऑर्डर के बारे में कुछ भी पूछें।',
    transcriptHeading: 'आपने पूछा:',
    aiResponseHeading: 'किसानसेतु उत्तर:',
    actionExecuted: 'उपलब्ध त्वरित कार्य:',
  },
  ordersView: {
    title: 'ऑर्डर, पिकअप एवं भुगतान',
    subtitle: 'खेत से सीधी उठान, वाहन की लाइव ट्रैकिंग और सुरक्षित एस्क्रो बैंक भुगतान।',
    activeOrdersTab: 'सक्रिय ऑर्डर',
    completedOrdersTab: 'पूरे हो चुके ऑर्डर',
    orderNo: 'ऑर्डर संख्या',
    buyer: 'खरीदार',
    cropAndLot: 'फसल लॉट',
    rate: 'भाव',
    totalAmount: 'कुल राशि',
    orderDate: 'ऑर्डर तारीख',
    pickupSchedule: 'पिकअप समय',
    status: 'स्थिति',
    trackVehicle: 'पिकअप गाड़ी ट्रैक करें',
    callDriver: 'ड्राइवर को कॉल करें',
    escrowStatus: 'एस्क्रो स्थिति',
    offerSubmitted: 'ऑफर स्वीकृत',
    pickupScheduled: 'पिकअप तय',
    inTransit: 'रास्ते में',
    delivered: 'डिलिवर हुआ',
    paymentCompleted: 'भुगतान पूरा',
    noOrdersFound: 'इस टैब में कोई ऑर्डर नहीं है।',
    assignedDriver: 'नियुक्त ड्राइवर व गाड़ी',
    viewReceiptBtn: 'एस्क्रो रसीद देखें',
    steps: {
      step1: 'ऑफर स्वीकृत हुआ',
      step2: 'एस्क्रो में राशि जमा',
      step3: 'पिकअप गाड़ी निर्धारित',
      step4: 'गाड़ी खेत पर पहुंची',
      step5: 'वजन व गुणवत्ता जांच',
      step6: 'खरीदार को माल मिला',
      step7: 'बैंक खाते में भुगतान पूरा',
    },
  },
  enquiriesView: {
    title: 'खरीदार पूछताछ एवं बोलियां',
    subtitle: 'सत्यापित खरीदारों के ऑफर देखें, मोल-भाव करें या तुरंत फसल बिक्री स्वीकार करें।',
    newBadge: 'नया ऑफर',
    counteredBadge: 'काउंटर भेजा गया',
    acceptedBadge: 'स्वीकृत',
    declinedBadge: 'अस्वीकृत',
    offeredRate: 'खरीदार का भाव',
    yourRate: 'आपका भाव',
    acceptBtn: 'ऑफर स्वीकार करें',
    counterBtn: 'काउंटर भाव भेजें',
    declineBtn: 'अस्वीकार करें',
    enterCounterPrice: 'अपना काउंटर भाव दर्ज करें (₹/किलो):',
    sendCounter: 'काउंटर भाव भेजें',
    noEnquiries: 'कोई लंबित पूछताछ नहीं है।',
    noEnquiriesFound: 'वर्तमान में कोई नई पूछताछ नहीं है।',
    quantity: 'मांग मात्रा',
    acceptBidBtn: 'खरीदार की बोली स्वीकार करें',
    counterRateBtn: 'काउंटर भाव दें',
    submitCounterBtn: 'काउंटर भाव भेजें',
  },
  notificationsView: {
    title: 'मार्केटप्लेस सूचनाएं एवं अलर्ट',
    subtitle: 'खरीदार बोलियों, गाड़ी आगमन, मूल्य अलर्ट और रसीदों की ताजा जानकारी।',
    markAllRead: 'सभी को पढ़ा हुआ चिन्हित करें',
    markAllReadBtn: 'सभी को पढ़ा हुआ चिन्हित करें',
    viewTabBtn: 'विवरण देखें',
    emptyNotifications: 'इस समय कोई नई सूचना नहीं है।',
    noNotifications: 'आपके पास कोई नई सूचना नहीं है।',
  },
  profileView: {
    title: 'किसान प्रोफाइल एवं सत्यापन',
    subtitle: 'आपकी पंजीकृत भूमि, बैंक खाते और ई-केवाईसी सत्यापन स्थिति।',
    kisanId: 'किसान आईडी',
    contactInfo: 'संपर्क जानकारी',
    farmDetails: 'खेत एवं भूमि विवरण',
    eKycStatus: 'ई-केवाईसी सत्यापन',
    kccStatus: 'किसान क्रेडिट कार्ड (KCC)',
    soilHealthCard: 'मृदा स्वास्थ्य कार्ड',
    landArea: 'कुल कृषि भूमि',
    landType: 'मिट्टी का प्रकार व सिंचाई',
    primaryCrops: 'मुख्य फसलें',
    memberSince: 'सदस्यता वर्ष',
    switchAccount: 'खरीदार खाते में बदलें',
    farmLandTitle: 'कृषि भूमि व सिंचाई साधन',
    bankDetailsTitle: 'बैंक खाता एवं एस्क्रो भुगतान',
    totalLandArea: 'कुल भूमि क्षेत्र',
    soilType: 'मिट्टी का प्रकार',
    irrigationSource: 'सिंचाई का साधन',
    bankName: 'बैंक का नाम',
    accountNumber: 'खाता संख्या',
    ifscCode: 'आईएफएससी कोड',
    payoutMode: 'भुगतान का माध्यम',
  },
  common: {
    rupeeSymbol: '₹',
    kg: 'किलो',
    quintal: 'क्विंटल',
    kmAway: 'किमी दूर',
    verifiedBadge: 'सत्यापित',
    close: 'बंद करें',
    save: 'सुरक्षित करें',
    back: 'पीछे जाएं',
    loading: 'लोड हो रहा है...',
    or: 'या',
    all: 'सभी',
    today: 'आज',
    cancel: 'रद्द करें',
  },
};

// 2. ENGLISH
const en: FarmerTranslationDict = {
  nav: {
    brandSubtitle: 'Kisan Marketplace',
    home: 'Home',
    myCrops: 'My Crops',
    sellCrop: 'Sell Crop',
    findBuyers: 'Find Buyers',
    marketPrices: 'Market Prices',
    aiAnalysis: 'AI Analysis',
    voiceAssistant: 'Voice Assistant',
    orders: 'Orders',
    enquiries: 'Enquiries',
    profile: 'Profile',
    notifications: 'Notifications',
    storageProcessing: 'Storage & Mill',
    searchPlaceholder: 'Search crops, varieties, buyers...',
    searchBtn: 'Search',
    signOut: 'Sign Out / Switch Account',
    eKycVerified: 'e-KYC Verified',
    menu: 'Menu',
    language: 'Language',
  },
  home: {
    greetingMorning: 'Good Morning, {name}! 🌾',
    greetingAfternoon: 'Good Afternoon, {name}! 🌾',
    greetingEvening: 'Good Evening, {name}! 🌾',
    welcomeSub: 'Welcome to your KisanSetu Farmer Dashboard. Here are your harvest inventory, today mandi prices, and matched buyer offers.',
    quickStats: {
      myCrops: 'My Crops',
      totalAvailable: 'Total Available Stock',
      activeOrders: 'Active Orders',
      verifiedRate: 'Avg Mandi Rate',
    },
    quickActions: {
      title: 'Quick Actions',
      addCrop: 'Add Crop to Sell',
      addCropSub: 'Post new harvest & photos',
      findBuyer: 'Find Buyers',
      findBuyerSub: 'Direct mill & retail buyers',
      aiAnalysis: 'AI Crop Analysis',
      aiAnalysisSub: 'Sell now vs store recommendations',
      voiceAssistant: 'Voice Assistant',
      voiceAssistantSub: 'Speak in Hindi or English',
    },
    categories: {
      all: 'All Crops',
      wheat: 'Wheat',
      rice: 'Rice',
      maize: 'Maize',
      pulses: 'Pulses',
    },
    sections: {
      myCropsTitle: 'My Listed Crops for Sale',
      myCropsSub: 'Active lots available on KisanSetu Marketplace',
      viewAll: 'View All',
      matchedBuyersTitle: 'Matched Direct Buyers',
      matchedBuyersSub: 'Verified buyers offering top prices for your crops',
      marketPricesTitle: 'Live APMC Mandi Rates',
      marketPricesSub: 'Real-time market rates from nearest mandis',
      recentOrderTitle: 'Recent Active Order & Pickup',
      recentOrderSub: 'Live logistics tracking and payment status',
      aiRecommendationTitle: 'AI Harvest Decision Recommendation',
      trackOrder: 'Track Order',
    },
    cropCard: {
      grade: 'Grade',
      mandiRate: 'Mandi Rate',
      expectedRate: 'My Rate',
      available: 'Available',
      sellNow: 'Sell to Buyers',
      edit: 'Edit Lot',
      viewDetails: 'View Details',
      verifiedLot: 'Verified Lot',
      unitKg: 'kg',
      unitQuintal: 'Quintals',
    },
    buyerCard: {
      verified: 'Verified Buyer',
      required: 'Requirement',
      offeredRate: 'Offered Rate',
      distance: 'Distance',
      match: 'Match',
      makeOffer: 'Submit Bid',
      contact: 'Contact',
      escrowProtected: 'Escrow Protected',
    },
  },
  myCropsView: {
    title: 'My Crops Inventory',
    subtitle: 'Manage your active harvest lots, set expected rates, and connect with direct buyers.',
    addNewCropBtn: '+ Add Crop to Sell',
    allCrops: 'All Harvests',
    availableForSale: 'Available for Sale',
    inNegotiation: 'In Negotiation',
    soldLots: 'Sold Lots',
    totalStock: 'Total Stock',
    expectedValue: 'Expected Market Realization',
    editListing: 'Edit Crop',
    deleteListing: 'Remove Crop',
    confirmDelete: 'Are you sure you want to remove this crop from your listings?',
    noCropsFound: 'No crop lots listed yet. Click "+ Add Crop to Sell" to create your first listing.',
    showing: 'Showing',
    cropsListed: 'crops listed',
    harvestDate: 'Harvest Date',
    moistureContent: 'Moisture',
    delete: 'Delete',
  },
  addCropModal: {
    title: 'Sell New Crop Lot',
    subtitle: 'List your agricultural harvest with quality grade, photos, and expected selling price.',
    cropNameLabel: 'Crop Name',
    varietyLabel: 'Variety',
    categoryLabel: 'Category',
    quantityLabel: 'Harvest Quantity (kg)',
    gradeLabel: 'Quality Grade',
    expectedPriceLabel: 'Your Selling Price (₹/kg)',
    mandiPriceLabel: 'Current Mandi Rate (₹/kg)',
    photoLabel: 'Select Crop Photo',
    publishBtn: 'Publish Crop for Sale',
    modalTitleNew: 'List New Harvest Crop',
    modalTitleEdit: 'Edit Crop Listing',
    cropNamePlaceholder: 'e.g. Sharbati Wheat, Basmati Rice, Yellow Maize',
    varietyPlaceholder: 'e.g. Hybrid Himsona, Lokwan, Pusa 1121',
    quantityPlaceholder: 'e.g. 1500',
    harvestDateLabel: 'Harvest Date',
    locationLabel: 'Farm Location / Village',
    storageLocationLabel: 'Storage Location',
    descriptionLabel: 'Quality & Storage Notes',
    descriptionPlaceholder: 'e.g. Well-sorted harvest, moisture under 12%, packed in 50kg bags',
    photoUploadTitle: 'Crop Photos',
    photoUploadHint: 'Select from certified crop photos or upload clear picture',
    cancelBtn: 'Cancel',
    submitBtnNew: 'Publish Crop on Marketplace',
    submitBtnEdit: 'Save Changes',
    successMessage: 'Crop successfully listed on KisanSetu marketplace!',
  },
  searchBuyersView: {
    title: 'Find Verified Direct Buyers 🌾',
    subtitle: 'Connect with institutional food processors, retail chains, and bulk traders offering top prices.',
    searchPlaceholder: 'Search crop, variety, or buyer (e.g. Mother Dairy, Wheat)...',
    filterByCrop: 'Filter by Crop',
    availableBuyers: 'Available Verified Buyers',
    noBuyersFound: 'No buyers found matching your search. Try a different crop name.',
    away: 'away',
    quantityNeeded: 'Quantity Needed',
    pickupFacility: 'Pickup Logistics',
    farmPickupAvailable: 'Farmgate Pickup Available',
    makeOfferBtn: 'Submit Bid Offer',
    contactBtn: 'Call Buyer',
  },
  marketPricesView: {
    title: 'Official AGMARKNET Mandi Rates & Trends',
    subtitle: 'Verified daily market bulletins from the Directorate of Marketing & Inspection (DMI), Ministry of Agriculture & Farmers Welfare, GoI.',
    liveMandiPrices: 'Government Mandi Price Bulletin',
    actualVsProjectedNotice: 'All rates are benchmarked against official AGMARKNET / State APMC records.',
    actualMandiBadge: 'Official AGMARKNET Record',
    projectedBadge: 'Market Movement',
    searchCropPlaceholder: 'Search official mandi rates (e.g. Bareilly, Wheat, Rice)...',
    filterMandi: 'Filter Mandi',
    nearestMandiLabel: 'APMC Yard & District',
    lastUpdated: 'Official Mandi Bulletin',
    trendUp: 'Price Increasing',
    trendDown: 'Price Decreasing',
    trendStable: 'Price Stable',
    viewPriceHistory: 'View 7-Day History',
    demandVeryHigh: 'Very High Mandi Arrivals',
    demandHigh: 'High Mandi Arrivals',
    demandModerate: 'Moderate Mandi Arrivals',
    todayMin: "Today's Min",
    modalAverage: 'Modal Rate',
    todayMax: "Today's Max",
    currentMarketPrice: 'Latest Modal Price',
    historicalTrend: '7-Day Price Movement',
    priceUnavailable: 'Official data not reported for this date',
    historyUnavailable: '7-day official bulletin history is currently unavailable.',
    demoBadge: 'Demo / Illustrative Data',
    priceAlertsHeading: 'SMS & WhatsApp Price Alert',
    priceAlertSub: 'Receive an instant SMS alert when the mandi rate reaches your desired target.',
    smsAlertActivated: 'Price alert set! You will receive an SMS when rates match.',
    targetPriceLabel: 'Target Price (₹/kg)',
    setAlertBtn: 'Set Price Alert',
    officialGovSource: 'Official Source: AGMARKNET (agmarknet.gov.in)',
    dmiAttribution: 'Directorate of Marketing & Inspection, Ministry of Agriculture & Farmers Welfare, Government of India',
    arrivalDateLabel: 'Arrival Date',
    quintalUnit: '₹/Quintal',
    perKgUnit: '₹/kg',
    ratePerQuintal: 'Rate (₹/Quintal)',
    ratePerKg: 'Rate (₹/kg)',
    stateSelectLabel: 'State',
    districtSelectLabel: 'District',
    mandiSelectLabel: 'Market (Mandi)',
    commoditySelectLabel: 'Commodity (Crop)',
    varietySelectLabel: 'Variety',
    allOption: 'All',
    searchMandiBtn: 'Search Official Mandi Data',
    officialMode: 'Official AGMARKNET Data',
    demoMode: 'Demo Market Data',
    modeToggleLabel: 'Data Source Mode:',
    multiMandiCompareTitle: 'Multi-Mandi Rate Comparison',
    multiMandiCompareSub: 'Compare modal prices across nearby district mandis to choose the best destination for your produce.',
    nearestMandiBadge: 'Nearest APMC Mandi',
    highestRateBadge: 'Highest Rate Mandi',
    averageRateAcrossMandis: 'Avg Modal Rate Across Mandis',
    noOfficialRecordsFound: 'No official AGMARKNET records found for the selected filters. Please select "All" or try another crop.',
    officialRecordsFound: 'Official Government Mandi Records Retrieved',
    liveApiActive: 'Live AGMARKNET API Connected',
    officialSnapshotActive: 'Official AGMARKNET Verified Bulletin',
    mandiDataUnavailable: 'Official government mandi data temporarily unavailable',
    mandiCompareUnavailable: 'Official mandi comparison data is currently unavailable.',
    mandiHistoryUnavailable: 'Historical official government data is currently unavailable.',
    singleRecordAvailable: 'Only 1 verified government price record is available for this selection.',
    showingGovRecordsPrefix: 'Showing',
    showingGovRecordsSuffix: 'actual government mandi records available within the 7-day window.',
    showingAllGovRecords: 'Showing all 7 actual government mandi records available within the past 7 days.',
    arrivalDatesGovReported: 'Arrival dates are based on official government reports.',
    officialGovMandiDataBadge: 'Official Government Mandi Data',
    apiProvenanceLabel: 'Source: Government of India — AGMARKNET',
    dataDateLabel: 'Data Date',
    lastFetchLabel: 'Last Successful API Fetch',
  },
  aiAnalysisView: {
    title: 'AI Harvest Decision Engine',
    subtitle: 'Net realization comparison: Sell Now vs Cold Storage vs Mill Processing.',
    badge: 'KisanSetu Farmer Intelligence',
    selectCropPrompt: 'Select Crop for Decision Analysis:',
    currentCropAnalysis: 'Analysis for Selected Crop',
    marketStateHeading: 'Current Market Conditions',
    calculatedEstimateTag: 'Calculated Net Realization',
    actualMandiTag: 'Actual Mandi Rate',
    projectedTrendTag: '30-Day Outlook',
    optionASellNow: 'Option A: Sell Now (Direct Buyer)',
    optionBColdStorage: 'Option B: Store in Cold Storage',
    optionCProcessMill: 'Option C: Partner Processing Mill',
    recommendedDecision: 'Recommended Decision',
    recommendedBadge: 'AI Recommended Strategy',
    netRealization: 'Estimated Net Realization',
    timeline: 'Payout Timeline',
    riskLevel: 'Risk Level',
    lowRisk: 'Low Risk',
    mediumRisk: 'Medium Risk',
    highRisk: 'High Risk',
    grossRevenue: 'Gross Revenue',
    transportCost: 'Transport & Freight',
    storageCost: 'Storage Charges',
    processingCost: 'Processing Fee',
    actionAcceptOffer: 'Sell to Top Buyer',
    actionBookStorage: 'Book Cold Storage',
    actionContactProcessor: 'Connect with Processing Mill',
    aiExplanationHeading: 'Why is this the optimal strategy for you?',
  },
  voiceAssistantView: {
    title: '🎙️ Kisan Voice Assistant',
    subtitle: 'Speak in Hindi or English to check live mandi rates, find direct buyers, or sell your harvest.',
    listeningStatus: 'Listening to your voice... Speak now',
    idleStatus: 'Tap microphone to speak in Hindi or English',
    speakingStatus: 'Assistant is responding...',
    tapToSpeakBtn: 'Tap to Speak',
    stopListeningBtn: 'Stop Listening',
    quickPromptsHeading: 'Quick Voice Commands:',
    prompt1: 'What is today wheat mandi rate in Bareilly?',
    prompt2: 'Find verified direct buyers for my Sharbati wheat',
    prompt3: 'Open the sell crop listing form',
    prompt4: 'Show AI harvest storage vs sell recommendation',
    prompt5: 'Where is the pickup truck for my order?',
    voiceFeedbackWelcome: 'Namaste! I am your Kisan Voice Assistant. Tap the microphone and ask me anything about mandi rates, direct buyers, or order tracking.',
    transcriptHeading: 'You Said:',
    aiResponseHeading: 'KisanSetu AI Response:',
    actionExecuted: 'Quick Actions Available:',
  },
  ordersView: {
    title: 'Orders, Pickups & Escrow Payouts',
    subtitle: 'Farmgate pickup, live transport vehicle tracking, and guaranteed bank settlement.',
    activeOrdersTab: 'Active Orders',
    completedOrdersTab: 'Completed Orders',
    orderNo: 'Order No',
    buyer: 'Buyer',
    cropAndLot: 'Crop & Lot',
    rate: 'Rate',
    totalAmount: 'Total Amount',
    orderDate: 'Order Date',
    pickupSchedule: 'Pickup Schedule',
    status: 'Status',
    trackVehicle: 'Track Pickup Vehicle',
    callDriver: 'Call Driver',
    escrowStatus: 'Escrow Status',
    offerSubmitted: 'Offer Accepted',
    pickupScheduled: 'Pickup Scheduled',
    inTransit: 'In Transit',
    delivered: 'Delivered',
    paymentCompleted: 'Payment Released',
    noOrdersFound: 'No orders found in this tab.',
    assignedDriver: 'Assigned Driver & Vehicle',
    viewReceiptBtn: 'View Escrow Receipt',
    steps: {
      step1: 'Offer Accepted',
      step2: 'Escrow Funded by Buyer',
      step3: 'Pickup Vehicle Scheduled',
      step4: 'Vehicle Arrived at Farmgate',
      step5: 'Quality & Weighment Verified',
      step6: 'Delivered at Buyer Hub',
      step7: 'Bank Payout Completed',
    },
  },
  enquiriesView: {
    title: 'Buyer Enquiries & Bids',
    subtitle: 'Review buyer bid offers, negotiate counter-rates, or accept instant purchase orders.',
    newBadge: 'New Offer',
    counteredBadge: 'Counter Sent',
    acceptedBadge: 'Accepted',
    declinedBadge: 'Declined',
    offeredRate: 'Buyer Rate',
    yourRate: 'Your Rate',
    acceptBtn: 'Accept Bid Offer',
    counterBtn: 'Send Counter Price',
    declineBtn: 'Decline',
    enterCounterPrice: 'Enter your counter price (₹/kg):',
    sendCounter: 'Send Counter Bid',
    noEnquiries: 'No pending buyer enquiries.',
    noEnquiriesFound: 'No buyer enquiries found at this moment.',
    quantity: 'Required Quantity',
    acceptBidBtn: 'Accept Buyer Bid',
    counterRateBtn: 'Counter Rate',
    submitCounterBtn: 'Submit Counter Rate',
  },
  notificationsView: {
    title: 'Marketplace Notifications & Alerts',
    subtitle: 'Real-time updates on buyer bids, vehicle arrivals, price movements, and payout receipts.',
    markAllRead: 'Mark All Read',
    markAllReadBtn: 'Mark all as read',
    viewTabBtn: 'View Details',
    emptyNotifications: 'No new notifications right now.',
    noNotifications: 'You have no new notifications.',
  },
  profileView: {
    title: 'Farmer Profile & Verification',
    subtitle: 'Manage your verified land records, bank account details, and e-KYC status.',
    kisanId: 'Kisan ID',
    contactInfo: 'Contact Information',
    farmDetails: 'Farm & Land Details',
    eKycStatus: 'e-KYC Status',
    kccStatus: 'Kisan Credit Card (KCC)',
    soilHealthCard: 'Soil Health Card',
    landArea: 'Total Cultivated Land',
    landType: 'Soil Type & Irrigation',
    primaryCrops: 'Primary Crops',
    memberSince: 'Member Since',
    switchAccount: 'Switch to Buyer Account',
    farmLandTitle: 'Farm Land & Irrigation Assets',
    bankDetailsTitle: 'Bank Account & Escrow Payouts',
    totalLandArea: 'Total Land Area',
    soilType: 'Soil Type',
    irrigationSource: 'Irrigation Source',
    bankName: 'Bank Name',
    accountNumber: 'Account Number',
    ifscCode: 'IFSC Code',
    payoutMode: 'Payout Settlement Mode',
  },
  common: {
    rupeeSymbol: '₹',
    kg: 'kg',
    quintal: 'Quintal',
    kmAway: 'km away',
    verifiedBadge: 'Verified',
    close: 'Close',
    save: 'Save',
    back: 'Back',
    loading: 'Loading...',
    or: 'or',
    all: 'All',
    today: 'Today',
    cancel: 'Cancel',
  },
};

// 3. PUNJABI (ਪੰਜਾਬੀ)
const pa: FarmerTranslationDict = {
  nav: {
    brandSubtitle: 'ਕਿਸਾਨ ਮਾਰਕਿਟਪਲੇਸ',
    home: 'ਘਰ',
    myCrops: 'ਮੇਰੀਆਂ ਫਸਲਾਂ',
    sellCrop: 'ਫਸਲ ਵੇਚੋ',
    findBuyers: 'ਖਰੀਦਦਾਰ ਲੱਭੋ',
    marketPrices: 'ਮੰਡੀ ਭਾਅ',
    aiAnalysis: 'ਏਆਈ ਵਿਸ਼ਲੇਸ਼ਣ',
    voiceAssistant: 'ਵੌਇਸ ਅਸਿਸਟੈਂਟ',
    orders: 'ਆਰਡਰ',
    enquiries: 'ਪੁੱਛਗਿੱਛ',
    profile: 'ਪ੍ਰੋਫਾਈਲ',
    notifications: 'ਸੂਚਨਾਵਾਂ',
    storageProcessing: 'ਸਟੋਰੇਜ ਤੇ ਪ੍ਰੋਸੈਸਿੰਗ',
    searchPlaceholder: 'ਫਸਲ, ਕਿਸਮ ਜਾਂ ਖਰੀਦਦਾਰ ਖੋਜੋ...',
    searchBtn: 'ਖੋਜੋ',
    signOut: 'ਲਾਗ ਆਊਟ / ਖਾਤਾ ਬਦਲੋ',
    eKycVerified: 'ਈ-ਕੇਵਾਈਸੀ ਤਸਦੀਕਸ਼ੁਦਾ',
    menu: 'ਮੀਨੂ',
    language: 'ਭਾਸ਼ਾ',
  },
  home: {
    greetingMorning: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, {name} ਜੀ! 🌾',
    greetingAfternoon: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ, {name} ਜੀ! 🌾',
    greetingEvening: 'ਸ਼ਾਮ ਮੁਬਾਰਕ, {name} ਜੀ! 🌾',
    welcomeSub: 'ਕਿਸਾਨਸੇਤੂ ਕਿਸਾਨ ਪੋਰਟਲ ਤੇ ਤੁਹਾਡਾ ਸਵਾਗਤ ਹੈ। ਇੱਥੇ ਤੁਹਾਡੀਆਂ ਫਸਲਾਂ ਦੀ ਸੂਚੀ, ਅੱਜ ਦੇ ਮੰਡੀ ਭਾਅ ਅਤੇ ਖਰੀਦਦਾਰਾਂ ਦੇ ਸਿੱਧੇ ਆਫਰ ਉਪਲਬਧ ਹਨ।',
    quickStats: {
      myCrops: 'ਮੇਰੀਆਂ ਫਸਲਾਂ',
      totalAvailable: 'ਕੁੱਲ ਉਪਲਬਧ ਸਟਾਕ',
      activeOrders: 'ਚੱਲ ਰਹੇ ਆਰਡਰ',
      verifiedRate: 'ਔਸਤ ਮੰਡੀ ਭਾਅ',
    },
    quickActions: {
      title: 'ਜ਼ਰੂਰੀ ਕੰਮ',
      addCrop: 'ਫਸਲ ਵੇਚੋ / ਜੋੜੋ',
      addCropSub: 'ਨਵੀਂ ਫਸਲ ਤੇ ਫੋਟੋ ਸ਼ਾਮਲ ਕਰੋ',
      findBuyer: 'ਖਰੀਦਦਾਰ ਲੱਭੋ',
      findBuyerSub: 'ਮਿੱਲਾਂ ਤੇ ਵੱਡੇ ਵਪਾਰੀ',
      aiAnalysis: 'ਏਆਈ ਫਸਲ ਵਿਸ਼ਲੇਸ਼ਣ',
      aiAnalysisSub: 'ਹੁਣੇ ਵੇਚੋ ਜਾਂ ਰੋਕ ਕੇ ਲਾਭ ਲਓ',
      voiceAssistant: 'ਵੌਇਸ ਅਸਿਸਟੈਂਟ',
      voiceAssistantSub: 'ਬੋਲ ਕੇ ਭਾਅ ਤੇ ਖਰੀਦਦਾਰ ਜਾਣੋ',
    },
    categories: {
      all: 'ਸਾਰੀਆਂ ਫਸਲਾਂ',
      wheat: 'ਕਣਕ',
      rice: 'ਝੋਨਾ / ਚਾਵਲ',
      maize: 'ਮੱਕੀ',
      pulses: 'ਦਾਲਾਂ / ਛੋਲੇ',
    },
    sections: {
      myCropsTitle: 'ਵਿਕਰੀ ਲਈ ਮੇਰੀਆਂ ਫਸਲਾਂ',
      myCropsSub: 'ਕਿਸਾਨਸੇਤੂ ਤੇ ਉਪਲਬਧ ਤੁਹਾਡੇ ਫਸਲ ਲਾਟ',
      viewAll: 'ਸਾਰੇ ਦੇਖੋ',
      matchedBuyersTitle: 'ਸਿੱਧੇ ਤਸਦੀਕਸ਼ੁਦਾ ਖਰੀਦਦਾਰ',
      matchedBuyersSub: 'ਤੁਹਾਡੀ ਫਸਲ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਮੁੱਲ ਦੇਣ ਵਾਲੇ ਖਰੀਦਦਾਰ',
      marketPricesTitle: 'ਅੱਜ ਦੇ ਲਾਈਵ ਮੰਡੀ ਭਾਅ',
      marketPricesSub: 'ਨੇੜਲੀਆਂ ਮੰਡੀਆਂ ਦੇ ਤਾਜ਼ਾ ਭਾਅ',
      recentOrderTitle: 'ਹਾਲੀਆ ਆਰਡਰ ਤੇ ਪਿਕਅੱਪ',
      recentOrderSub: 'ਗੱਡੀ ਟਰੈਕਿੰਗ ਤੇ ਬੈਂਕ ਭੁਗਤਾਨ',
      aiRecommendationTitle: 'ਏਆਈ ਫਸਲ ਵਿਕਰੀ ਸਲਾਹ',
      trackOrder: 'ਆਰਡਰ ਟਰੈਕ ਕਰੋ',
    },
    cropCard: {
      grade: 'ਗ੍ਰੇਡ',
      mandiRate: 'ਮੰਡੀ ਭਾਅ',
      expectedRate: 'ਮੇਰਾ ਰੇਟ',
      available: 'ਉਪਲਬਧ',
      sellNow: 'ਖਰੀਦਦਾਰ ਨੂੰ ਵੇਚੋ',
      edit: 'ਸੋਧੋ',
      viewDetails: 'ਵੇਰਵੇ ਦੇਖੋ',
      verifiedLot: 'ਤਸਦੀਕਸ਼ੁਦਾ ਲਾਟ',
      unitKg: 'ਕਿਲੋ',
      unitQuintal: 'ਕੁਇੰਟਲ',
    },
    buyerCard: {
      verified: 'ਤਸਦੀਕਸ਼ੁਦਾ ਖਰੀਦਦਾਰ',
      required: 'ਮੰਗ',
      offeredRate: 'ਪੇਸ਼ਕਸ਼ ਰੇਟ',
      distance: 'ਦੂਰੀ',
      match: 'ਮੇਲ',
      makeOffer: 'ਆਫਰ ਭੇਜੋ',
      contact: 'ਸੰਪਰਕ ਕਰੋ',
      escrowProtected: 'ਐਸਕਰੋ ਸੁਰੱਖਿਅਤ ਭੁਗਤਾਨ',
    },
  },
  myCropsView: {
    title: 'ਮੇਰੀਆਂ ਫਸਲਾਂ ਦਾ ਸਟਾਕ',
    subtitle: 'ਆਪਣੀਆਂ ਫਸਲਾਂ ਦੀ ਸੂਚੀ ਸੰਭਾਲੋ, ਮਨਪਸੰਦ ਰੇਟ ਤੈਅ ਕਰੋ ਤੇ ਖਰੀਦਦਾਰਾਂ ਨਾਲ ਜੁੜੋ।',
    addNewCropBtn: '+ ਫਸਲ ਵੇਚੋ / ਜੋੜੋ',
    allCrops: 'ਸਾਰੀਆਂ ਫਸਲਾਂ',
    availableForSale: 'ਵਿਕਰੀ ਲਈ ਉਪਲਬਧ',
    inNegotiation: 'ਗੱਲਬਾਤ ਚੱਲ ਰਹੀ ਹੈ',
    soldLots: 'ਵਿਕ ਚੁੱਕੀਆਂ ਫਸਲਾਂ',
    totalStock: 'ਕੁੱਲ ਸਟਾਕ',
    expectedValue: 'ਅਨੁਮਾਨਿਤ ਕੁੱਲ ਮੁੱਲ',
    editListing: 'ਫਸਲ ਸੋਧੋ',
    deleteListing: 'ਫਸਲ ਹਟਾਓ',
    confirmDelete: 'ਕੀ ਤੁਸੀਂ ਵਾਕਈ ਇਸ ਫਸਲ ਨੂੰ ਆਪਣੀ ਸੂਚੀ ਵਿੱਚੋਂ ਹਟਾਉਣਾ ਚਾਹੁੰਦੇ ਹੋ?',
    noCropsFound: 'ਅਜੇ ਕੋਈ ਫਸਲ ਦਰਜ ਨਹੀਂ ਹੈ। ਪਹਿਲੀ ਫਸਲ ਜੋੜਨ ਲਈ "+ ਫਸਲ ਵੇਚੋ" ਦਬਾਓ।',
    showing: 'ਦਿਖਾ ਰਹੇ ਹਾਂ',
    cropsListed: 'ਫਸਲਾਂ ਸੂਚੀਬੱਧ',
    harvestDate: 'ਵਾਢੀ ਦੀ ਮਿਤੀ',
    moistureContent: 'ਨਮੀ (Moisture)',
    delete: 'ਹਟਾਓ',
  },
  addCropModal: {
    title: 'ਵਿਕਰੀ ਲਈ ਨਵੀਂ ਫਸਲ ਜੋੜੋ',
    subtitle: 'ਫਸਲ ਦੀ ਗੁਣਵੱਤਾ, ਫੋਟੋ ਅਤੇ ਆਪਣਾ ਮੁੱਲ ਦਰਜ ਕਰੋ।',
    cropNameLabel: 'ਫਸਲ ਦਾ ਨਾਮ',
    varietyLabel: 'ਕਿਸਮ (ਵਰਾਈਟੀ)',
    categoryLabel: 'ਸ਼੍ਰੇਣੀ',
    quantityLabel: 'ਮਾਤਰਾ (ਕਿਲੋ ਵਿੱਚ)',
    gradeLabel: 'ਕੁਆਲਿਟੀ ਗ੍ਰੇਡ',
    expectedPriceLabel: 'ਤੁਹਾਡਾ ਵਿਕਰੀ ਰੇਟ (₹/ਕਿਲੋ)',
    mandiPriceLabel: 'ਮੌਜੂਦਾ ਮੰਡੀ ਭਾਅ (₹/ਕਿਲੋ)',
    photoLabel: 'ਫਸਲ ਦੀ ਫੋਟੋ ਚੁਣੋ',
    publishBtn: 'ਫਸਲ ਵਿਕਰੀ ਲਈ ਪੋਸਟ ਕਰੋ',
    modalTitleNew: 'ਨਵੀਂ ਫਸਲ ਦਰਜ ਕਰੋ',
    modalTitleEdit: 'ਫਸਲ ਵੇਰਵਾ ਬਦਲੋ',
    cropNamePlaceholder: 'ਜਿਵੇਂ: ਟਮਾਟਰ, ਸ਼ਰਬਤੀ ਕਣਕ, ਬਾਸਮਤੀ ਝੋਨਾ',
    varietyPlaceholder: 'ਜਿਵੇਂ: ਹਾਈਬ੍ਰਿਡ ਹਿਮਸੋਨਾ, ਲੋਕਵਾਨ, ਪੂਸਾ 1121',
    quantityPlaceholder: 'ਜਿਵੇਂ: 1500',
    harvestDateLabel: 'ਵਾਢੀ ਦੀ ਮਿਤੀ',
    locationLabel: 'ਖੇਤ ਦਾ ਸਥਾਨ / ਪਿੰਡ',
    storageLocationLabel: 'ਸਟੋਰੇਜ ਸਥਾਨ',
    descriptionLabel: 'ਕੁਆਲਿਟੀ ਤੇ ਸਟੋਰੇਜ ਨੋਟਸ',
    descriptionPlaceholder: 'ਜਿਵੇਂ: ਚੰਗੀ ਤਰ੍ਹਾਂ ਸਾਫ਼ ਕੀਤੀ ਫਸਲ, ਨਮੀ 12% ਤੋਂ ਘੱਟ',
    photoUploadTitle: 'ਫਸਲ ਦੀਆਂ ਫੋਟੋਆਂ',
    photoUploadHint: 'ਸਰਟੀਫਾਈਡ ਫੋਟੋਆਂ ਵਿੱਚੋਂ ਚੁਣੋ ਜਾਂ ਨਵੀਂ ਫੋਟੋ ਅੱਪਲੋਡ ਕਰੋ',
    cancelBtn: 'ਰੱਦ ਕਰੋ',
    submitBtnNew: 'ਮਾਰਕਿਟਪਲੇਸ ਤੇ ਪੋਸਟ ਕਰੋ',
    submitBtnEdit: 'ਤਬਦੀਲੀਆਂ ਸਾਂਭੋ',
    successMessage: 'ਫਸਲ ਸਫਲਤਾਪੂਰਵਕ ਕਿਸਾਨਸੇਤੂ ਤੇ ਪੋਸਟ ਹੋ ਗਈ!',
  },
  searchBuyersView: {
    title: 'ਤਸਦੀਕਸ਼ੁਦਾ ਖਰੀਦਦਾਰ ਲੱਭੋ 🌾',
    subtitle: 'ਫੂਡ ਪ੍ਰੋਸੈਸਰਾਂ, ਮਿੱਲਾਂ ਤੇ ਵੱਡੇ ਵਪਾਰੀਆਂ ਨਾਲ ਸਿੱਧਾ ਜੁੜੋ ਅਤੇ ਵਧੀਆ ਭਾਅ ਪਾਓ।',
    searchPlaceholder: 'ਫਸਲ, ਕਿਸਮ ਜਾਂ ਖਰੀਦਦਾਰ ਲੱਭੋ (ਜਿਵੇਂ ਮਦਰ ਡੇਅਰੀ, ਕਣਕ)...',
    filterByCrop: 'ਫਸਲ ਅਨੁਸਾਰ ਫਿਲਟਰ',
    availableBuyers: 'ਉਪਲਬਧ ਤਸਦੀਕਸ਼ੁਦਾ ਖਰੀਦਦਾਰ',
    noBuyersFound: 'ਤੁਹਾਡੀ ਖੋਜ ਮੁਤਾਬਕ ਕੋਈ ਖਰੀਦਦਾਰ ਨਹੀਂ ਮਿਲਿਆ।',
    away: 'ਦੂਰ',
    quantityNeeded: 'ਲੋੜੀਂਦੀ ਮਾਤਰਾ',
    pickupFacility: 'ਪਿਕਅੱਪ ਸਹੂਲਤ',
    farmPickupAvailable: 'ਖੇਤ ਤੋਂ ਸਿੱਧੀ ਚੁਕਾਈ ਉਪਲਬਧ',
    makeOfferBtn: 'ਬੋਲੀ / ਆਫਰ ਭੇਜੋ',
    contactBtn: 'ਖਰੀਦਦਾਰ ਨੂੰ ਫੋਨ ਕਰੋ',
  },
  marketPricesView: {
    ...hi.marketPricesView,
    title: 'ਸਰਕਾਰੀ AGMARKNET ਮੰਡੀ ਭਾਅ ਤੇ ਰੁਝਾਨ',
    subtitle: 'ਖੇਤੀਬਾੜੀ ਮੰਤਰਾਲਾ, ਭਾਰਤ ਸਰਕਾਰ ਵੱਲੋਂ ਤਸਦੀਕਸ਼ੁਦਾ ਰੋਜ਼ਾਨਾ ਮੰਡੀ ਬੁਲੇਟਿਨ।',
    liveMandiPrices: 'ਸਰਕਾਰੀ ਮੰਡੀ ਭਾਅ ਬੁਲੇਟਿਨ',
  },
  aiAnalysisView: {
    ...hi.aiAnalysisView,
    title: 'ਏਆਈ ਫਸਲ ਵਿਕਰੀ ਫੈਸਲਾ ਇੰਜਣ',
    subtitle: 'ਮੁਨਾਫੇ ਦੀ ਤੁਲਨਾ: ਹੁਣੇ ਵੇਚੋ vs ਕੋਲਡ ਸਟੋਰੇਜ vs ਮਿੱਲ ਪ੍ਰੋਸੈਸਿੰਗ।',
  },
  voiceAssistantView: {
    ...hi.voiceAssistantView,
    title: '🎙️ ਕਿਸਾਨ ਵੌਇਸ ਅਸਿਸਟੈਂਟ',
    subtitle: 'ਮੰਡੀ ਭਾਅ ਜਾਣਨ, ਖਰੀਦਦਾਰ ਲੱਭਣ ਜਾਂ ਫਸਲ ਵੇਚਣ ਲਈ ਬੋਲੋ।',
  },
  ordersView: {
    ...hi.ordersView,
    title: 'ਆਰਡਰ, ਪਿਕਅੱਪ ਤੇ ਭੁਗਤਾਨ',
    subtitle: 'ਖੇਤ ਤੋਂ ਸਿੱਧੀ ਚੁਕਾਈ, ਗੱਡੀ ਦੀ ਲਾਈਵ ਟਰੈਕਿੰਗ ਤੇ ਐਸਕਰੋ ਭੁਗਤਾਨ।',
  },
  enquiriesView: hi.enquiriesView,
  notificationsView: hi.notificationsView,
  profileView: hi.profileView,
  common: {
    rupeeSymbol: '₹',
    kg: 'ਕਿਲੋ',
    quintal: 'ਕੁਇੰਟਲ',
    kmAway: 'ਕਿਮੀ ਦੂਰ',
    verifiedBadge: 'ਤਸਦੀਕਸ਼ੁਦਾ',
    close: 'ਬੰਦ ਕਰੋ',
    save: 'ਸਾਂਭੋ',
    back: 'ਪਿੱਛੇ ਜਾਓ',
    loading: 'ਲੋਡ ਹੋ ਰਿਹਾ ਹੈ...',
    or: 'ਜਾਂ',
    all: 'ਸਾਰੇ',
    today: 'ਅੱਜ',
    cancel: 'ਰੱਦ ਕਰੋ',
  },
};

// 4. HARYANVI (हरियाणवी)
const hr: FarmerTranslationDict = {
  ...hi,
  nav: {
    ...hi.nav,
    brandSubtitle: 'किसान मार्केटप्लेस',
    home: 'म्हारा घर',
    myCrops: 'म्हारी फसलें',
    sellCrop: 'फसल बेचो',
    findBuyers: 'खरीदार ढूंढो',
    marketPrices: 'मंडी भाव',
    aiAnalysis: 'एआई सलाह',
    voiceAssistant: 'वॉयस असिस्टेंट',
    orders: 'ऑर्डर्स',
    enquiries: 'पूछताछ',
    profile: 'प्रोफ़ाइल',
  },
  home: {
    ...hi.home,
    greetingMorning: 'राम-राम, {name} जी! 🌾',
    greetingAfternoon: 'राम-राम, {name} जी! 🌾',
    greetingEvening: 'राम-राम, {name} जी! 🌾',
    welcomeSub: 'किसानसेतु पोर्टल पै थारा स्वागत सै। थारी फसल, आज के मंडी भाव अर सीधे खरीदार तैयार सैं।',
  },
};

// 5. TELUGU (తెలుగు)
const te: FarmerTranslationDict = {
  nav: {
    brandSubtitle: 'రైతు మార్కెట్‌ప్లేస్',
    home: 'హోమ్',
    myCrops: 'నా పంటలు',
    sellCrop: 'పంట అమ్మండి',
    findBuyers: 'కొనుగోలుదారులను కనుగొనండి',
    marketPrices: 'మార్కెట్ ధరలు',
    aiAnalysis: 'AI విశ్లేషణ',
    voiceAssistant: 'వాయిస్ అసిస్టెంట్',
    orders: 'ఆర్డర్లు',
    enquiries: 'విచారణలు',
    profile: 'ప్రొఫైల్',
    notifications: 'నోటిఫికేషన్లు',
    storageProcessing: 'నిల్వ & ప్రాసెసింగ్',
    searchPlaceholder: 'పంట, రకం లేదా కొనుగోలుదారుని శోధించండి...',
    searchBtn: 'శోధించండి',
    signOut: 'లాగ్ అవుట్',
    eKycVerified: 'e-KYC ధృవీకరించబడింది',
    menu: 'మెనూ',
    language: 'భాష',
  },
  home: {
    greetingMorning: 'శుభోదయం, {name} గారు! 🌾',
    greetingAfternoon: 'శుభ మధ్యాహ్నం, {name} గారు! 🌾',
    greetingEvening: 'శుభ సాయంత్రం, {name} గారు! 🌾',
    welcomeSub: 'కిసాన్‌సేతు రైతు పోర్టల్‌కు స్వాగతం. మీ పంటల జాబితా, నేటి మార్కెట్ ధరలు మరియు ప్రత్యక్ష ఆఫర్లు ఇక్కడ అందుబాటులో ఉన్నాయి.',
    quickStats: {
      myCrops: 'నా పంటలు',
      totalAvailable: 'మొత్తం అందుబాటులో ఉన్న నిల్వ',
      activeOrders: 'క్రియాశీల ఆర్డర్లు',
      verifiedRate: 'సగటు మార్కెట్ ధర',
    },
    quickActions: {
      title: 'త్వరిత చర్యలు',
      addCrop: 'పంట అమ్మండి / జోడించండి',
      addCropSub: 'కొత్త పంట వివరాలు & ఫోటోలు',
      findBuyer: 'కొనుగోలుదారులను కనుగొనండి',
      findBuyerSub: 'మిల్లులు & ప్రత్యక్ష వ్యాపారులు',
      aiAnalysis: 'AI పంట విశ్లేషణ',
      aiAnalysisSub: 'ఇప్పుడే అమ్మాలా లేదా నిల్వ చేయాలా',
      voiceAssistant: 'వాయిస్ అసిస్టెంట్',
      voiceAssistantSub: 'ధరలు & కొనుగోలుదారుల కోసం మాట్లాడండి',
    },
    categories: {
      all: 'అన్ని పంటలు',
      wheat: 'గోధుమ',
      rice: 'వరి / బియ్యం',
      maize: 'మొక్కజొన్న',
      pulses: 'పప్పుధాన్యాలు',
    },
    sections: {
      myCropsTitle: 'అమ్మకానికి నా పంటలు',
      myCropsSub: 'కిసాన్‌సేతు మార్కెట్‌ప్లేస్‌లో క్రియాశీల లాట్లు',
      viewAll: 'అన్నీ చూడండి',
      matchedBuyersTitle: 'సరిపోలిన ప్రత్యక్ష కొనుగోలుదారులు',
      matchedBuyersSub: 'మీ పంటకు ఉత్తమ ధర ఇచ్చే ధృవీకరించిన కొనుగోలుదారులు',
      marketPricesTitle: 'నేటి లైవ్ మార్కెట్ ధరలు',
      marketPricesSub: 'సమీప మార్కెట్ యార్డుల తాజా ధరలు',
      recentOrderTitle: 'ఇటీవలి ఆర్డర్ & పికప్',
      recentOrderSub: 'వాహన ట్రాకింగ్ & బ్యాంకు చెల్లింపు',
      aiRecommendationTitle: 'AI పంట అమ్మకపు సలహా',
      trackOrder: 'ఆర్డర్ ట్రాక్ చేయండి',
    },
    cropCard: {
      grade: 'గ్రేడ్',
      mandiRate: 'మార్కెట్ ధర',
      expectedRate: 'నా ధర',
      available: 'అందుబాటులో ఉంది',
      sellNow: 'కొనుగోలుదారుకు అమ్మండి',
      edit: 'సవరించండి',
      viewDetails: 'వివరాలు చూడండి',
      verifiedLot: 'ధృవీకరించిన లాట్',
      unitKg: 'కిలో',
      unitQuintal: 'క్వింటాల్',
    },
    buyerCard: {
      verified: 'ధృవీకరించిన కొనుగోలుదారు',
      required: 'అవసరం',
      offeredRate: 'ఆఫర్ ధర',
      distance: 'దూరం',
      match: 'సరిపోలిక',
      makeOffer: 'ఆఫర్ పంపండి',
      contact: 'సంప్రదించండి',
      escrowProtected: 'ఎస్క్రో రక్షిత చెల్లింపు',
    },
  },
  myCropsView: {
    ...hi.myCropsView,
    title: 'నా పంటల నిల్వ',
    subtitle: 'మీ పంటల లిస్టింగ్‌లను నిర్వహించండి మరియు కొనుగోలుదారులతో కనెక్ట్ అవ్వండి.',
    addNewCropBtn: '+ పంట అమ్మండి / జోడించండి',
    allCrops: 'అన్ని పంటలు',
    availableForSale: 'అమ్మకానికి అందుబాటులో ఉంది',
  },
  addCropModal: hi.addCropModal,
  searchBuyersView: hi.searchBuyersView,
  marketPricesView: hi.marketPricesView,
  aiAnalysisView: hi.aiAnalysisView,
  voiceAssistantView: hi.voiceAssistantView,
  ordersView: hi.ordersView,
  enquiriesView: hi.enquiriesView,
  notificationsView: hi.notificationsView,
  profileView: hi.profileView,
  common: {
    rupeeSymbol: '₹',
    kg: 'కిలో',
    quintal: 'క్వింటాల్',
    kmAway: 'కి.మీ దూరంలో',
    verifiedBadge: 'ధృవీకరించబడింది',
    close: 'మూసివేయండి',
    save: 'సేవ్ చేయండి',
    back: 'వెనుకకు',
    loading: 'లోడ్ అవుతోంది...',
    or: 'లేదా',
    all: 'అన్నీ',
    today: 'ఈ రోజు',
    cancel: 'రద్దు చేయండి',
  },
};

// 6. TAMIL (தமிழ்)
const ta: FarmerTranslationDict = {
  nav: {
    brandSubtitle: 'விவசாய சந்தை',
    home: 'முகப்பு',
    myCrops: 'என் பயிர்கள்',
    sellCrop: 'பயிர் விற்க',
    findBuyers: 'வாங்குபவர்களைக் கண்டறியவும்',
    marketPrices: 'மண்டி விலை',
    aiAnalysis: 'AI பகுப்பாய்வு',
    voiceAssistant: 'குரல் உதவியாளர்',
    orders: 'ஆர்டர்கள்',
    enquiries: 'விசாரணைகள்',
    profile: 'சுயவிவரம்',
    notifications: 'அறிவிப்புகள்',
    storageProcessing: 'சேமிப்பு & ஆலை',
    searchPlaceholder: 'பயிர், ரகம் அல்லது வாங்குபவரைத் தேடுங்கள்...',
    searchBtn: 'தேடு',
    signOut: 'வெளியேறு',
    eKycVerified: 'e-KYC சரிபார்க்கப்பட்டது',
    menu: 'பட்டி',
    language: 'மொழி',
  },
  home: {
    greetingMorning: 'காலை வணக்கம், {name} அவர்களே! 🌾',
    greetingAfternoon: 'மதிய வணக்கம், {name} அவர்களே! 🌾',
    greetingEvening: 'மாலை வணக்கம், {name} அவர்களே! 🌾',
    welcomeSub: 'கிசான்சேது விவசாயி தளத்திற்கு வரவேற்கிறோம். உங்கள் பயிர்களின் பட்டியல், இன்றைய மண்டி விலைகள் மற்றும் நேரடி சலுகைகள் இங்கே உள்ளன.',
    quickStats: {
      myCrops: 'என் பயிர்கள்',
      totalAvailable: 'மொத்த இருப்பு',
      activeOrders: 'செயலில் உள்ள ஆர்டர்கள்',
      verifiedRate: 'சராசரி மண்டி விலை',
    },
    quickActions: {
      title: 'விரைவுச் செயல்கள்',
      addCrop: 'பயிர் விற்க / சேர்க்க',
      addCropSub: 'புதிய அறுவடை விவரங்கள் & படங்கள்',
      findBuyer: 'வாங்குபவர்களைக் கண்டறியவும்',
      findBuyerSub: 'ஆலைகள் & நேரடி வர்த்தகர்கள்',
      aiAnalysis: 'AI பயிர் பகுப்பாய்வு',
      aiAnalysisSub: 'இப்போதே விற்கவா அல்லது சேமிக்கவா',
      voiceAssistant: 'குரல் உதவியாளர்',
      voiceAssistantSub: 'விலை மற்றும் வாங்குபവരെ அறிய பேசவும்',
    },
    categories: {
      all: 'அனைத்து பயிர்கள்',
      wheat: 'கோதுமை',
      rice: 'நெல் / அரிசி',
      maize: 'மக்காச்சோளம்',
      pulses: 'பருப்பு வகைகள்',
    },
    sections: {
      myCropsTitle: 'விற்பனைக்கான என் பயிர்கள்',
      myCropsSub: 'கிசான்சேது சந்தையில் உங்கள் நேரடி பயிர் தொகுதிகள்',
      viewAll: 'அனைத்தையும் காண்க',
      matchedBuyersTitle: 'பொருந்திய நேரடி வாங்குபவர்கள்',
      matchedBuyersSub: 'உங்கள் பயிருக்கு சிறந்த விலை வழங்கும் வாங்குபவர்கள்',
      marketPricesTitle: 'இன்றைய நேரடி மண்டி விலைகள்',
      marketPricesSub: 'அருகிலுள்ள மண்டி சந்தைகளின் சமீபத்திய விலைகள்',
      recentOrderTitle: 'சமீபத்திய ஆர்டர் & பிக்கப்',
      recentOrderSub: 'வாகன கண்காணிப்பு & வங்கி பணம் செலுத்துதல்',
      aiRecommendationTitle: 'AI பயிர் விற்பனை ஆலோசனை',
      trackOrder: 'ஆர்டரைக் கண்காணிக்கவும்',
    },
    cropCard: {
      grade: 'தரம்',
      mandiRate: 'மண்டி விலை',
      expectedRate: 'என் விலை',
      available: 'இருப்பு உள்ளது',
      sellNow: 'வாங்குபவருக்கு விற்க',
      edit: 'திருத்து',
      viewDetails: 'விவரங்களைக் காண்க',
      verifiedLot: 'சரிபார்க்கப்பட்ட தொகுதி',
      unitKg: 'கிலோ',
      unitQuintal: 'குவிண்டால்',
    },
    buyerCard: {
      verified: 'சரிபார்க்கப்பட்ட வாங்குபவர்',
      required: 'தேவை',
      offeredRate: 'சலுகை விலை',
      distance: 'தொலைவு',
      match: 'பொருத்தம்',
      makeOffer: 'சலுகையை அனுப்பவும்',
      contact: 'தொடர்பு கொள்ளவும்',
      escrowProtected: 'எஸ்க்ரோ பாதுகாக்கப்பட்ட பணம்',
    },
  },
  myCropsView: {
    ...hi.myCropsView,
    title: 'என் பயிர்கள் இருப்பு',
    subtitle: 'உங்கள் பயிர்களின் பட்டியலை நிர்வகிக்கவும் மற்றும் வாங்குபவர்களுடன் இணையவும்.',
    addNewCropBtn: '+ பயிர் விற்க / சேர்க்க',
    allCrops: 'அனைத்து பயிர்கள்',
  },
  addCropModal: hi.addCropModal,
  searchBuyersView: hi.searchBuyersView,
  marketPricesView: hi.marketPricesView,
  aiAnalysisView: hi.aiAnalysisView,
  voiceAssistantView: hi.voiceAssistantView,
  ordersView: hi.ordersView,
  enquiriesView: hi.enquiriesView,
  notificationsView: hi.notificationsView,
  profileView: hi.profileView,
  common: {
    rupeeSymbol: '₹',
    kg: 'கிலோ',
    quintal: 'குவிண்டால்',
    kmAway: 'கி.மீ தொலைவில்',
    verifiedBadge: 'சரிபார்க்கப்பட்டது',
    close: 'மூடு',
    save: 'சேமி',
    back: 'பின்செல்',
    loading: 'ஏற்றுகிறது...',
    or: 'அல்லது',
    all: 'அனைத்தும்',
    today: 'இன்று',
    cancel: 'ரத்து செய்',
  },
};

export const farmerTranslations: Record<LanguageCode, FarmerTranslationDict> = {
  hi,
  en,
  pa,
  hr,
  te,
  ta,
};

export function getFarmerTranslations(lang: LanguageCode): FarmerTranslationDict {
  return farmerTranslations[lang] || farmerTranslations.hi;
}
