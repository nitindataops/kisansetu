import { LanguageCode } from '../types';

export interface BuyerTranslationsDict {
  navbar: {
    brandSub: string;
    searchPlaceholder: string;
    home: string;
    browseProduce: string;
    myProcurement: string;
    orders: string;
    messages: string;
    cart: string;
    profile: string;
    smartBuy: string;
    saveTheHarvest: string;
    switchToFarmer: string;
    logout: string;
  };
  topNotification: {
    text: string;
    learnMore: string;
  };
  welcome: {
    greeting: string;
    subtitle: string;
    buyerRole: string;
    locationPrefix: string;
  };
  quickActions: {
    browseProduce: string;
    browseProduceSub: string;
    postRequirement: string;
    postRequirementSub: string;
    smartBuy: string;
    smartBuySub: string;
    myOrders: string;
    myOrdersSub: string;
  };
  categories: {
    all: string;
    vegetables: string;
    fruits: string;
    grains: string;
    spices: string;
    pulses: string;
    oilseeds: string;
  };
  heroBanner: {
    badge: string;
    title: string;
    subtitle: string;
    cta: string;
    secondaryCta: string;
  };
  filters: {
    title: string;
    apply: string;
    clearAll: string;
    location: string;
    priceRange: string;
    category: string;
    crop: string;
    variety: string;
    qualityGrade: string;
    farmer: string;
    verifiedOnly: string;
    minQty: string;
    allLocations: string;
    allCrops: string;
    allVarieties: string;
    allGrades: string;
    mobileFilterTitle: string;
    sortBy: string;
  };
  sorting: {
    recommended: string;
    nearestFarmer: string;
    largestPrice: string;
    lowestPrice: string;
    recentlyAdded: string;
  };
  productCard: {
    grade: string;
    perKg: string;
    available: string;
    verifiedFarmer: string;
    addToCart: string;
    addedToCart: string;
    viewDetails: string;
    favorite: string;
    minOrder: string;
    timeSensitive: string;
  };
  sections: {
    shopByProduce: string;
    shopByProduceSubtitle: string;
    featuredFarmers: string;
    topRatedSellers: string;
    newFarmEntries: string;
    saveTheHarvest: string;
    saveTheHarvestSub: string;
    smartBuyWidgetTitle: string;
    viewFarmerProfile: string;
    viewBatchQR: string;
    trackBatch: string;
    smartAlternativesTitle: string;
    noProductsFound: string;
    viewAll: string;
    recentViews: string;
    quickOrders: string;
    mandiTicker: string;
  };
  smartBuy: {
    title: string;
    subtitle: string;
    marketSignal: string;
    recommendation: string;
    bestTimeToBuy: string;
    currentRate: string;
    recentAvg: string;
    fiveDayTrend: string;
    confidence: string;
    states: {
      buyNow: string;
      consider: string;
      wait: string;
    };
    purchaseOpportunityScore: string;
    priceWatchTitle: string;
    targetPriceLabel: string;
    trackPriceBtn: string;
    trackingActive: string;
    disclaimer: string;
  };
  procurement: {
    title: string;
    subtitle: string;
    tabRequirements: string;
    tabPriceLocks: string;
    tabFutureDemand: string;
    tabBatchTraceability: string;
    postRequirementBtn: string;
    requirementsList: string;
    matchedFarmersBadge: string;
    similarityScore: string;
    farmerPoolingNotice: string;
    poolSupplyBtn: string;
    approvePoolBtn: string;
    createPriceLockBtn: string;
    futureDemandNotice: string;
    postDemandBtn: string;
    form: {
      crop: string;
      variety: string;
      grade: string;
      quantity: string;
      maxPrice: string;
      preferredLocation: string;
      maxDistance: string;
      deliveryDate: string;
      notes: string;
      submit: string;
    };
  };
  cart: {
    title: string;
    empty: string;
    qty: string;
    subtotal: string;
    mandiCess: string;
    transportEstimate: string;
    grandTotal: string;
    checkoutBtn: string;
    deliveryAddress: string;
    paymentMethod: string;
    placeOrder: string;
    orderSuccess: string;
    escrowGuarantee: string;
  };
  orders: {
    title: string;
    subtitle: string;
    orderId: string;
    date: string;
    farmer: string;
    crop: string;
    quantity: string;
    rate: string;
    total: string;
    status: string;
    tracking: string;
    driver: string;
    vehicle: string;
    viewInvoice: string;
    trackOrder: string;
  };
  messages: {
    title: string;
    subtitle: string;
    selectThread: string;
    typePlaceholder: string;
    send: string;
  };
  profile: {
    title: string;
    subtitle: string;
    editBtn: string;
    saveBtn: string;
    businessName: string;
    contactPerson: string;
    businessType: string;
    mobile: string;
    email: string;
    gstin: string;
    pan: string;
    deliveryHub: string;
    preferredCrops: string;
    verifiedBadge: string;
  };
}

export const buyerTranslations: Record<LanguageCode, BuyerTranslationsDict> = {
  // 1. PRIMARY & DEFAULT: HINDI (हिंदी)
  hi: {
    navbar: {
      brandSub: 'क्रेता मंडी',
      searchPlaceholder: 'फसल, किस्म, किसान या स्थान खोजें...',
      home: 'होम',
      browseProduce: 'फसलें देखें',
      myProcurement: 'मेरी खरीद (प्रोक्योरमेंट)',
      orders: 'ऑर्डर्स',
      messages: 'संदेश',
      cart: 'कार्ट',
      profile: 'प्रोफ़ाइल',
      smartBuy: 'स्मार्ट बाय',
      saveTheHarvest: 'सेव द हार्वेस्ट',
      switchToFarmer: 'किसान पोर्टल पर जाएं',
      logout: 'लॉग आउट',
    },
    topNotification: {
      text: '🌾 आपके क्षेत्र के सत्यापित किसानों से ताज़ा फसलें सीधे उपलब्ध हैं।',
      learnMore: 'फसलें देखें',
    },
    welcome: {
      greeting: 'शुभ प्रभात,',
      subtitle: 'सत्यापित किसानों से सीधे ताज़ा कृषि उत्पाद प्राप्त करें।',
      buyerRole: 'क्रेता / व्यापारी',
      locationPrefix: '📍',
    },
    quickActions: {
      browseProduce: 'फसलें देखें',
      browseProduceSub: 'सीधे फार्म-गेट लॉट खोजें',
      postRequirement: 'मांग दर्ज करें',
      postRequirementSub: 'किसानों से मिलान पाएं',
      smartBuy: 'स्मार्ट बाय',
      smartBuySub: 'मंडी भाव व खरीद सलाह',
      myOrders: 'मेरे ऑर्डर्स',
      myOrdersSub: 'लाइव डिलीवरी ट्रैक करें',
    },
    categories: {
      all: 'सभी श्रेणियां',
      vegetables: 'सब्जियां',
      fruits: 'फल',
      grains: 'अनाज',
      spices: 'मसाले',
      pulses: 'दालें',
      oilseeds: 'तिलहन',
    },
    heroBanner: {
      badge: 'सीधे खेत से खरीद',
      title: 'ताज़ा फसलों की सीधी खरीद',
      subtitle: 'पारदर्शी मंडी भाव के साथ उत्तम गुणवत्ता वाली फसलों का आधुनिक बाज़ार।',
      cta: 'अभी खरीदें',
      secondaryCta: 'मांग पोस्ट करें',
    },
    filters: {
      title: 'फ़िल्टर करें',
      apply: 'फ़िल्टर लागू करें',
      clearAll: 'सभी हटाएं',
      location: 'स्थान / राज्य',
      priceRange: 'मूल्य (₹/किग्रा)',
      category: 'श्रेणी',
      crop: 'फसल',
      variety: 'किस्म',
      qualityGrade: 'गुणवत्ता ग्रेड',
      farmer: 'किसान',
      verifiedOnly: 'केवल सत्यापित किसान',
      minQty: 'न्यूनतम उपलब्ध मात्रा',
      allLocations: 'सभी स्थान',
      allCrops: 'सभी फसलें',
      allVarieties: 'सभी किस्में',
      allGrades: 'सभी ग्रेड',
      mobileFilterTitle: 'फ़िल्टर और क्रमबद्ध करें',
      sortBy: 'क्रमबद्ध करें',
    },
    sorting: {
      recommended: 'अनुशंसित',
      nearestFarmer: 'निकटतम किसान (दूरी)',
      largestPrice: 'मूल्य: अधिक से कम',
      lowestPrice: 'मूल्य: कम से अधिक',
      recentlyAdded: 'हाल ही में जोड़ी गई',
    },
    productCard: {
      grade: 'ग्रेड',
      perKg: '/किग्रा',
      available: 'उपलब्ध:',
      verifiedFarmer: 'सत्यापित किसान',
      addToCart: 'कार्ट में जोड़ें',
      addedToCart: 'जोड़ा गया ✓',
      viewDetails: 'विवरण देखें',
      favorite: 'पसंदीदा',
      minOrder: 'न्यूनतम ऑर्डर:',
      timeSensitive: 'समय-संवेदनशील फसल',
    },
    sections: {
      shopByProduce: 'फसल अनुसार खरीदारी',
      shopByProduceSubtitle: 'सत्यापित किसानों से सीधे ताज़ा फसल बैच',
      featuredFarmers: 'प्रमुख किसान',
      topRatedSellers: 'शीर्ष रेटेड विक्रेता',
      newFarmEntries: 'नई प्रविष्टियां',
      saveTheHarvest: 'सेव द हार्वेस्ट ♻️',
      saveTheHarvestSub: 'समय-संवेदनशील ताज़ा फसलें - भोजन बर्बादी रोकने हेतु विशेष दर',
      smartBuyWidgetTitle: '🧠 स्मार्ट बाय मंडी संकेत',
      viewFarmerProfile: 'प्रोफ़ाइल देखें',
      viewBatchQR: 'बैच QR देखें',
      trackBatch: 'इस बैच को ट्रैक करें',
      smartAlternativesTitle: 'स्मार्ट विकल्प',
      noProductsFound: 'फ़िल्टर के अनुसार कोई फसल नहीं मिली।',
      viewAll: 'सभी देखें',
      recentViews: 'हाल ही में देखी गई',
      quickOrders: 'लाइव ऑर्डर स्थिति',
      mandiTicker: 'लाइव APMC मंडी बेंचमार्क',
    },
    smartBuy: {
      title: 'किसानसेतु स्मार्ट बाय सहायक',
      subtitle: 'AGMARKNET बेंचमार्क आधारित डेटा-समर्थित खरीद विश्लेषण',
      marketSignal: 'मंडी संकेत',
      recommendation: 'सलाह',
      bestTimeToBuy: 'खरीदने का सर्वोत्तम समय',
      currentRate: 'वर्तमान दर',
      recentAvg: '7-दिवसीय APMC औसत',
      fiveDayTrend: 'अनुमानित 5-दिवसीय रुझान',
      confidence: 'संकेत विश्वसनीयता',
      states: {
        buyNow: 'अभी खरीदें - उत्तम मूल्य',
        consider: 'खरीद पर विचार करें',
        wait: 'दाम घटने की प्रतीक्षा करें',
      },
      purchaseOpportunityScore: 'किसानसेतु खरीद अवसर स्कोर',
      priceWatchTitle: 'मूल्य अलर्ट (प्राइस वॉच)',
      targetPriceLabel: 'लक्षित मूल्य (₹/किग्रा)',
      trackPriceBtn: 'मूल्य ट्रैक करें',
      trackingActive: 'मूल्य अलर्ट सक्रिय है',
      disclaimer: 'यह अनुमान ऐतिहासिक मंडी आवक, मौसम और व्यापार गति पर आधारित एआई मॉडल द्वारा उत्पन्न है।',
    },
    procurement: {
      title: 'मेरी खरीद डेस्क',
      subtitle: 'थोक मांग दर्ज करें, भविष्य के भाव तय करें और सामूहिक किसान आपूर्ति पाएं',
      tabRequirements: 'मांग व किसान मिलान',
      tabPriceLocks: 'मूल्य लॉक (Price Lock)',
      tabFutureDemand: 'भावी मांग (Future Demand)',
      tabBatchTraceability: 'बैच ट्रेसिबिलिटी',
      postRequirementBtn: '+ नई मांग दर्ज करें',
      requirementsList: 'सक्रिय थोक मांगें',
      matchedFarmersBadge: 'मिलान वाले किसान',
      similarityScore: 'समानता स्कोर',
      farmerPoolingNotice: 'आपकी मात्रा को पूरा करने के लिए आसपास के कई किसान मिलकर आपूर्ति कर सकते हैं।',
      poolSupplyBtn: 'सामूहिक आपूर्ति की समीक्षा करें',
      approvePoolBtn: 'स्वीकार करें और सामूहिक ऑर्डर बनाएं',
      createPriceLockBtn: '+ भावी मूल्य लॉक प्रस्ताव भेजें',
      futureDemandNotice: 'आगामी सीजन के लिए अपनी फसल मांग सत्यापित किसान समूहों के साथ साझा करें।',
      postDemandBtn: '+ भावी मांग साझा करें',
      form: {
        crop: 'फसल का नाम',
        variety: 'किस्म',
        grade: 'गुणवत्ता ग्रेड',
        quantity: 'आवश्यक मात्रा (किग्रा)',
        maxPrice: 'अधिकतम बजट दर (₹/किग्रा)',
        preferredLocation: 'पसंदीदा स्थान / क्षेत्र',
        maxDistance: 'अधिकतम दूरी (किमी)',
        deliveryDate: 'डिलीवरी की तिथि',
        notes: 'विशेष निर्देश',
        submit: 'मिलान वाले किसान खोजें',
      },
    },
    cart: {
      title: 'खरीद कार्ट',
      empty: 'आपकी कार्ट खाली है। मंडी से ताज़ा फसल लॉट जोड़ें।',
      qty: 'मात्रा (किग्रा)',
      subtotal: 'फसल उप-योग',
      mandiCess: 'मंडी शुल्क व हैंडलिंग (1.5%)',
      transportEstimate: 'अनुमानित परिवहन शुल्क',
      grandTotal: 'कुल ऑर्डर मूल्य',
      checkoutBtn: 'सुरक्षित चेकआउट करें',
      deliveryAddress: 'डिलीवरी गोदाम का पता',
      paymentMethod: 'एस्क्रो भुगतान विधि',
      placeOrder: 'ऑर्डर पक्का करें',
      orderSuccess: '🎉 मंडी एस्क्रो के माध्यम से ऑर्डर सफलतापूर्वक दर्ज हुआ!',
      escrowGuarantee: 'किसानसेतु मंडी एस्क्रो सुरक्षा: डिलीवरी व गुणवत्ता जांच के बाद ही किसान को भुगतान किया जाता है।',
    },
    orders: {
      title: 'मेरे ऑर्डर्स',
      subtitle: 'लाइव डिलीवरी, रसीदें और पूरी हुई खरीद का विवरण देखें',
      orderId: 'ऑर्डर आईडी',
      date: 'दिनांक',
      farmer: 'किसान',
      crop: 'फसल व किस्म',
      quantity: 'मात्रा',
      rate: 'दर',
      total: 'कुल राशि',
      status: 'स्थिति',
      tracking: 'लाइव प्रेषण विवरण',
      driver: 'ड्राइवर',
      vehicle: 'वाहन संख्या',
      viewInvoice: 'रसीद डाउनलोड करें',
      trackOrder: 'लाइव ट्रैक करें',
    },
    messages: {
      title: 'किसान संदेश व बातचीत',
      subtitle: 'सत्यापित फसल उत्पादकों से सीधा संपर्क',
      selectThread: 'बातचीत शुरू करने के लिए किसान चुनें',
      typePlaceholder: 'किसान को संदेश लिखें...',
      send: 'संदेश भेजें',
    },
    profile: {
      title: 'क्रेता व्यापार प्रोफ़ाइल',
      subtitle: 'अपने व्यापार का विवरण, डिलीवरी हब और खरीद प्राथमिकताएं प्रबंधित करें',
      editBtn: 'प्रोफ़ाइल संपादित करें',
      saveBtn: 'परिवर्तन सहेजें',
      businessName: 'व्यवसाय का नाम',
      contactPerson: 'संपर्क व्यक्ति',
      businessType: 'व्यवसाय का प्रकार',
      mobile: 'मोबाइल नंबर',
      email: 'ईमेल पता',
      gstin: 'GSTIN (मास्क्ड)',
      pan: 'PAN (मास्क्ड)',
      deliveryHub: 'मुख्य डिलीवरी गोदाम',
      preferredCrops: 'पसंदीदा फसलें',
      verifiedBadge: 'सत्यापित वाणिज्यिक क्रेता',
    },
  },

  // 2. ENGLISH
  en: {
    navbar: {
      brandSub: 'Buyer Marketplace',
      searchPlaceholder: 'Search crops, varieties, farmers, locations...',
      home: 'Home',
      browseProduce: 'Browse Produce',
      myProcurement: 'My Procurement',
      orders: 'Orders',
      messages: 'Messages',
      cart: 'Cart',
      profile: 'Profile',
      smartBuy: 'Smart Buy',
      saveTheHarvest: 'Save the Harvest',
      switchToFarmer: 'Switch to Farmer Portal',
      logout: 'Log Out',
    },
    topNotification: {
      text: '🌾 Fresh harvests available from verified farmers in your region.',
      learnMore: 'Browse Produce',
    },
    welcome: {
      greeting: 'Good Morning,',
      subtitle: 'Find fresh produce directly from verified farmers.',
      buyerRole: 'Buyer',
      locationPrefix: '📍',
    },
    quickActions: {
      browseProduce: 'Browse Produce',
      browseProduceSub: 'Explore direct farm lots',
      postRequirement: 'Post Requirement',
      postRequirementSub: 'Get matched with farmers',
      smartBuy: 'Smart Buy',
      smartBuySub: 'AI price signals & timing',
      myOrders: 'My Orders',
      myOrdersSub: 'Track live dispatches',
    },
    categories: {
      all: 'All Categories',
      vegetables: 'Vegetables',
      fruits: 'Fruits',
      grains: 'Grains',
      spices: 'Spices',
      pulses: 'Pulses',
      oilseeds: 'Oilseeds',
    },
    heroBanner: {
      badge: 'DIRECT FARM-GATE SOURCING',
      title: 'EXPLORE FRESH HARVESTS TODAY',
      subtitle: 'Your personalized marketplace for quality farm-gate produce with transparent mandi pricing.',
      cta: 'Shop Now',
      secondaryCta: 'Post Requirement',
    },
    filters: {
      title: 'Filter By',
      apply: 'Apply Filters',
      clearAll: 'Clear All',
      location: 'Location / State',
      priceRange: 'Price (₹/kg)',
      category: 'Category',
      crop: 'Crop',
      variety: 'Variety',
      qualityGrade: 'Quality Grade',
      farmer: 'Farmer',
      verifiedOnly: 'Verified Farmers Only',
      minQty: 'Min Available Quantity',
      allLocations: 'All Locations',
      allCrops: 'All Crops',
      allVarieties: 'All Varieties',
      allGrades: 'All Grades',
      mobileFilterTitle: 'Filters & Sorting',
      sortBy: 'Sort By',
    },
    sorting: {
      recommended: 'Recommended',
      nearestFarmer: 'Nearest Farmer (Distance)',
      largestPrice: 'Price: High to Low',
      lowestPrice: 'Price: Low to High',
      recentlyAdded: 'Recently Added',
    },
    productCard: {
      grade: 'Grade',
      perKg: '/kg',
      available: 'Available:',
      verifiedFarmer: 'Verified Farmer',
      addToCart: 'Add to Cart',
      addedToCart: 'Added ✓',
      viewDetails: 'View Details',
      favorite: 'Favorite',
      minOrder: 'Min Order:',
      timeSensitive: 'Time-Sensitive Lot',
    },
    sections: {
      shopByProduce: 'Shop by Produce',
      shopByProduceSubtitle: 'Direct farm lots verified for quality and moisture standard',
      featuredFarmers: 'Featured Farmers',
      topRatedSellers: 'Top Rated Sellers',
      newFarmEntries: 'New Farm Listings',
      saveTheHarvest: 'Save the Harvest ♻️',
      saveTheHarvestSub: 'Time-sensitive fresh lots at reduced rates to minimize post-harvest food waste',
      smartBuyWidgetTitle: '🧠 Smart Buy Intelligence',
      viewFarmerProfile: 'View Farmer Profile',
      viewBatchQR: 'View Batch QR',
      trackBatch: 'Track This Batch',
      smartAlternativesTitle: 'Smart Alternatives',
      noProductsFound: 'No produce found matching your current filters.',
      viewAll: 'View All',
      recentViews: 'Recently Viewed',
      quickOrders: 'Live Order Status',
      mandiTicker: 'Live APMC Mandi Benchmarks',
    },
    smartBuy: {
      title: 'KisanSetu Smart Buy Engine',
      subtitle: 'Data-driven procurement timing powered by real-time AGMARKNET benchmarks',
      marketSignal: 'Market Signal',
      recommendation: 'Recommendation',
      bestTimeToBuy: 'Best Time to Buy',
      currentRate: 'Current Rate',
      recentAvg: '7-Day APMC Benchmark',
      fiveDayTrend: 'Projected 5-Day Trend',
      confidence: 'Signal Confidence',
      states: {
        buyNow: 'Buy Now - Peak Value',
        consider: 'Consider Procuring',
        wait: 'Wait for Price Softening',
      },
      purchaseOpportunityScore: 'KisanSetu Opportunity Score',
      priceWatchTitle: 'Price Alert (Price Watch)',
      targetPriceLabel: 'Target Price (₹/kg)',
      trackPriceBtn: 'Track Price',
      trackingActive: 'Price Alert Active',
      disclaimer: 'Signals are generated using historical APMC arrival patterns, seasonal weather indicators, and procurement volumes.',
    },
    procurement: {
      title: 'Procurement Command Desk',
      subtitle: 'Publish bulk requirements, secure forward price locks, and pool regional farmer supply',
      tabRequirements: 'Requirements & Match',
      tabPriceLocks: 'Price Locks',
      tabFutureDemand: 'Future Demand',
      tabBatchTraceability: 'Batch Traceability',
      postRequirementBtn: '+ Post Requirement',
      requirementsList: 'Active Bulk Requirements',
      matchedFarmersBadge: 'Matched Farmers',
      similarityScore: 'Match Score',
      farmerPoolingNotice: 'Multiple neighboring smallholder farmers can pool their harvest to fulfill your volume requirement.',
      poolSupplyBtn: 'Review Supply Pool',
      approvePoolBtn: 'Approve & Create Pooled Order',
      createPriceLockBtn: '+ Send Forward Price Lock Offer',
      futureDemandNotice: 'Signal upcoming procurement demand to verified farmer cooperatives before harvest season.',
      postDemandBtn: '+ Share Forward Demand',
      form: {
        crop: 'Crop Name',
        variety: 'Variety',
        grade: 'Quality Grade',
        quantity: 'Required Quantity (kg)',
        maxPrice: 'Max Budget (₹/kg)',
        preferredLocation: 'Preferred Sourcing Region',
        maxDistance: 'Max Distance (km)',
        deliveryDate: 'Expected Delivery Date',
        notes: 'Special Specifications',
        submit: 'Find Matching Farmers',
      },
    },
    cart: {
      title: 'Procurement Cart',
      empty: 'Your procurement cart is empty. Explore direct farm lots to add.',
      qty: 'Quantity (kg)',
      subtotal: 'Produce Subtotal',
      mandiCess: 'Market Cess & Handling (1.5%)',
      transportEstimate: 'Estimated Freight',
      grandTotal: 'Grand Total',
      checkoutBtn: 'Proceed to Secure Checkout',
      deliveryAddress: 'Delivery Hub Address',
      paymentMethod: 'Escrow Settlement Mode',
      placeOrder: 'Confirm Order & Lock Escrow',
      orderSuccess: '🎉 Order placed successfully with Mandi Escrow protection!',
      escrowGuarantee: 'KisanSetu Mandi Escrow Guarantee: Payment is released to farmers only upon verified arrival and quality inspection.',
    },
    orders: {
      title: 'Procurement Orders',
      subtitle: 'Monitor live dispatches, verify gate passes, and download digital tax invoices',
      orderId: 'Order ID',
      date: 'Date',
      farmer: 'Farmer',
      crop: 'Crop & Variety',
      quantity: 'Quantity',
      rate: 'Rate',
      total: 'Total Amount',
      status: 'Status',
      tracking: 'Live Dispatch Details',
      driver: 'Driver',
      vehicle: 'Vehicle No',
      viewInvoice: 'Download Invoice',
      trackOrder: 'Track Live',
    },
    messages: {
      title: 'Farmer Communications',
      subtitle: 'Direct encrypted messaging with verified crop producers',
      selectThread: 'Select a conversation to message the farmer',
      typePlaceholder: 'Type your message to the farmer...',
      send: 'Send Message',
    },
    profile: {
      title: 'Buyer Business Profile',
      subtitle: 'Manage your enterprise details, delivery hubs, and procurement preferences',
      editBtn: 'Edit Profile',
      saveBtn: 'Save Changes',
      businessName: 'Business Name',
      contactPerson: 'Contact Person',
      businessType: 'Business Type',
      mobile: 'Mobile Number',
      email: 'Email Address',
      gstin: 'GSTIN (Masked)',
      pan: 'PAN (Masked)',
      deliveryHub: 'Primary Delivery Warehouse',
      preferredCrops: 'Preferred Procurement Crops',
      verifiedBadge: 'Verified Commercial Buyer',
    },
  },

  // 3. PUNJABI (ਪੰਜਾਬੀ)
  pa: {
    navbar: {
      brandSub: 'ਖਰੀਦਦਾਰ ਮੰਡੀ',
      searchPlaceholder: 'ਫਸਲ, ਕਿਸਮ, ਕਿਸਾਨ ਜਾਂ ਸਥਾਨ ਖੋਜੋ...',
      home: 'ਘਰ',
      browseProduce: 'ਫਸਲਾਂ ਦੇਖੋ',
      myProcurement: 'ਮੇਰੀ ਖਰੀਦ',
      orders: 'ਆਰਡਰ',
      messages: 'ਸੁਨੇਹੇ',
      cart: 'ਕਾਰਟ',
      profile: 'ਪ੍ਰੋਫਾਈਲ',
      smartBuy: 'ਸਮਾਰਟ ਬਾਏ',
      saveTheHarvest: 'ਸੇਵ ਦ ਹਾਰਵੈਸਟ',
      switchToFarmer: 'ਕਿਸਾਨ ਪੋਰਟਲ ਤੇ ਜਾਓ',
      logout: 'ਲਾਗ ਆਊਟ',
    },
    topNotification: {
      text: '🌾 ਤੁਹਾਡੇ ਇਲਾਕੇ ਦੇ ਤਸਦੀਕਸ਼ੁਦਾ ਕਿਸਾਨਾਂ ਤੋਂ ਤਾਜ਼ੀਆਂ ਫਸਲਾਂ ਸਿੱਧੀਆਂ ਉਪਲਬਧ ਹਨ।',
      learnMore: 'ਫਸਲਾਂ ਦੇਖੋ',
    },
    welcome: {
      greeting: 'ਸਤਿ ਸ੍ਰੀ ਅਕਾਲ,',
      subtitle: 'ਤਸਦੀਕਸ਼ੁਦਾ ਕਿਸਾਨਾਂ ਤੋਂ ਸਿੱਧਾ ਤਾਜ਼ਾ ਅਨਾਜ ਅਤੇ ਉਪਜ ਪ੍ਰਾਪਤ ਕਰੋ।',
      buyerRole: 'ਖਰੀਦਦਾਰ / ਵਪਾਰੀ',
      locationPrefix: '📍',
    },
    quickActions: {
      browseProduce: 'ਫਸਲਾਂ ਦੇਖੋ',
      browseProduceSub: 'ਸਿੱਧੇ ਖੇਤਾਂ ਦੇ ਲਾਟ ਲੱਭੋ',
      postRequirement: 'ਮੰਗ ਦਰਜ ਕਰੋ',
      postRequirementSub: 'ਕਿਸਾਨਾਂ ਨਾਲ ਮੇਲ ਕਰੋ',
      smartBuy: 'ਸਮਾਰਟ ਬਾਏ',
      smartBuySub: 'ਮੰਡੀ ਭਾਅ ਤੇ ਖਰੀਦ ਸਲਾਹ',
      myOrders: 'ਮੇਰੇ ਆਰਡਰ',
      myOrdersSub: 'ਲਾਈਵ ਡਿਲਿਵਰੀ ਟਰੈਕ ਕਰੋ',
    },
    categories: {
      all: 'ਸਾਰੀਆਂ ਸ਼੍ਰੇਣੀਆਂ',
      vegetables: 'ਸਬਜ਼ੀਆਂ',
      fruits: 'ਫਲ',
      grains: 'ਅਨਾਜ',
      spices: 'ਮਸਾਲੇ',
      pulses: 'ਦਾਲਾਂ',
      oilseeds: 'ਤੇਲ ਬੀਜ',
    },
    heroBanner: {
      badge: 'ਸਿੱਧੀ ਖੇਤਾਂ ਤੋਂ ਖਰੀਦ',
      title: 'ਤਾਜ਼ੀਆਂ ਫਸਲਾਂ ਦੀ ਸਿੱਧੀ ਖਰੀਦ',
      subtitle: 'ਪਾਰਦਰਸ਼ੀ ਮੰਡੀ ਭਾਵਾਂ ਨਾਲ ਵਧੀਆ ਕੁਆਲਿਟੀ ਫਸਲਾਂ ਦਾ ਆਧੁਨਿਕ ਬਾਜ਼ਾਰ।',
      cta: 'ਹੁਣੇ ਖਰੀਦੋ',
      secondaryCta: 'ਮੰਗ ਪੋਸਟ ਕਰੋ',
    },
    filters: {
      title: 'ਫਿਲਟਰ ਕਰੋ',
      apply: 'ਫਿਲਟਰ ਲਾਗੂ ਕਰੋ',
      clearAll: 'ਸਾਰੇ ਹਟਾਓ',
      location: 'ਸਥਾਨ / ਰਾਜ',
      priceRange: 'ਮੁੱਲ (₹/ਕਿਲੋ)',
      category: 'ਸ਼੍ਰੇਣੀ',
      crop: 'ਫਸਲ',
      variety: 'ਕਿਸਮ',
      qualityGrade: 'ਕੁਆਲਿਟੀ ਗ੍ਰੇਡ',
      farmer: 'ਕਿਸਾਨ',
      verifiedOnly: 'ਸਿਰਫ਼ ਤਸਦੀਕਸ਼ੁਦਾ ਕਿਸਾਨ',
      minQty: 'ਘੱਟੋ-ਘੱਟ ਮਾਤਰਾ',
      allLocations: 'ਸਾਰੇ ਸਥਾਨ',
      allCrops: 'ਸਾਰੀਆਂ ਫਸਲਾਂ',
      allVarieties: 'ਸਾਰੀਆਂ ਕਿਸਮਾਂ',
      allGrades: 'ਸਾਰੇ ਗ੍ਰੇਡ',
      mobileFilterTitle: 'ਫਿਲਟਰ ਅਤੇ ਤਰਤੀਬ',
      sortBy: 'ਤਰਤੀਬ ਦਿਓ',
    },
    sorting: {
      recommended: 'ਸਿਫ਼ਾਰਿਸ਼ ਕੀਤਾ',
      nearestFarmer: 'ਸਭ ਤੋਂ ਨੇੜਲਾ ਕਿਸਾਨ',
      largestPrice: 'ਮੁੱਲ: ਵੱਧ ਤੋਂ ਘੱਟ',
      lowestPrice: 'ਮੁੱਲ: ਘੱਟ ਤੋਂ ਵੱਧ',
      recentlyAdded: 'ਹਾਲ ਹੀ ਵਿੱਚ ਸ਼ਾਮਲ',
    },
    productCard: {
      grade: 'ਗ੍ਰੇਡ',
      perKg: '/ਕਿਲੋ',
      available: 'ਉਪਲਬਧ:',
      verifiedFarmer: 'ਤਸਦੀਕਸ਼ੁਦਾ ਕਿਸਾਨ',
      addToCart: 'ਕਾਰਟ ਵਿੱਚ ਜੋੜੋ',
      addedToCart: 'ਜੋੜਿਆ ਗਿਆ ✓',
      viewDetails: 'ਵੇਰਵੇ ਦੇਖੋ',
      favorite: 'ਮਨਪਸੰਦ',
      minOrder: 'ਘੱਟੋ-ਘੱਟ ਆਰਡਰ:',
      timeSensitive: 'ਤਾਜ਼ਾ ਮਿਆਦੀ ਫਸਲ',
    },
    sections: {
      shopByProduce: 'ਫਸਲ ਮੁਤਾਬਕ ਖਰੀਦਦਾਰੀ',
      shopByProduceSubtitle: 'ਕਿਸਾਨਾਂ ਤੋਂ ਸਿੱਧੇ ਤਸਦੀਕਸ਼ੁਦਾ ਫਸਲ ਲਾਟ',
      featuredFarmers: 'ਮੁੱਖ ਕਿਸਾਨ',
      topRatedSellers: 'ਸਿਖਰਲੇ ਵਿਕਰੇਤਾ',
      newFarmEntries: 'ਨਵੀਆਂ ਫਸਲਾਂ',
      saveTheHarvest: 'ਸੇਵ ਦ ਹਾਰਵੈਸਟ ♻️',
      saveTheHarvestSub: 'ਫਸਲ ਦੀ ਬਰਬਾਦੀ ਰੋਕਣ ਲਈ ਵਿਸ਼ੇਸ਼ ਰਿਆਇਤੀ ਦਰਾਂ',
      smartBuyWidgetTitle: '🧠 ਸਮਾਰਟ ਬਾਏ ਮੰਡੀ ਸਿਗਨਲ',
      viewFarmerProfile: 'ਪ੍ਰੋਫਾਈਲ ਦੇਖੋ',
      viewBatchQR: 'ਬੈਚ QR ਦੇਖੋ',
      trackBatch: 'ਇਸ ਬੈਚ ਨੂੰ ਟਰੈਕ ਕਰੋ',
      smartAlternativesTitle: 'ਸਮਾਰਟ ਬਦਲ',
      noProductsFound: 'ਫਿਲਟਰ ਮੁਤਾਬਕ ਕੋਈ ਫਸਲ ਨਹੀਂ ਮਿਲੀ।',
      viewAll: 'ਸਾਰੇ ਦੇਖੋ',
      recentViews: 'ਹਾਲ ਹੀ ਵਿੱਚ ਦੇਖੇ ਗਏ',
      quickOrders: 'ਲਾਈਵ ਆਰਡਰ ਸਥਿਤੀ',
      mandiTicker: 'ਲਾਈਵ ਮੰਡੀ ਭਾਅ',
    },
    smartBuy: {
      title: 'ਕਿਸਾਨਸੇਤੂ ਸਮਾਰਟ ਬਾਏ ਸਹਾਇਕ',
      subtitle: 'ਸਰਕਾਰੀ AGMARKNET ਡੇਟਾ ਅਧਾਰਿਤ ਖਰੀਦ ਵਿਸ਼ਲੇਸ਼ਣ',
      marketSignal: 'ਮੰਡੀ ਸਿਗਨਲ',
      recommendation: 'ਸਲਾਹ',
      bestTimeToBuy: 'ਖਰੀਦਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ',
      currentRate: 'ਮੌਜੂਦਾ ਭਾਅ',
      recentAvg: '7-ਦਿਨਾਂ ਔਸਤ ਮੰਡੀ ਰੇਟ',
      fiveDayTrend: 'ਅਗਲੇ 5 ਦਿਨਾਂ ਦਾ ਰੁਝਾਨ',
      confidence: 'ਸਿਗਨਲ ਭਰੋਸੇਯੋਗਤਾ',
      states: {
        buyNow: 'ਹੁਣੇ ਖਰੀਦੋ - ਵਧੀਆ ਰੇਟ',
        consider: 'ਖਰੀਦ ਤੇ ਵਿਚਾਰ ਕਰੋ',
        wait: 'ਰੇਟ ਘਟਣ ਦੀ ਉਡੀਕ ਕਰੋ',
      },
      purchaseOpportunityScore: 'ਖਰੀਦ ਮੌਕਾ ਸਕੋਰ',
      priceWatchTitle: 'ਮੁੱਲ ਅਲਰਟ (ਪ੍ਰਾਈਸ ਵਾਚ)',
      targetPriceLabel: 'ਲੋੜੀਂਦਾ ਮੁੱਲ (₹/ਕਿਲੋ)',
      trackPriceBtn: 'ਮੁੱਲ ਟਰੈਕ ਕਰੋ',
      trackingActive: 'ਅਲਰਟ ਸਰਗਰਮ ਹੈ',
      disclaimer: 'ਇਹ ਅੰਦਾਜ਼ਾ ਮੰਡੀ ਆਵਕ ਅਤੇ ਮੌਸਮ ਅਧਾਰਿਤ ਏਆਈ ਮਾਡਲ ਦੁਆਰਾ ਤਿਆਰ ਕੀਤਾ ਗਿਆ ਹੈ।',
    },
    procurement: {
      title: 'ਮੇਰੀ ਖਰੀਦ ਡੈਸਕ',
      subtitle: 'ਥੋਕ ਮੰਗ ਦਰਜ ਕਰੋ, ਅਗੇਤੇ ਭਾਅ ਤੈਅ ਕਰੋ ਅਤੇ ਸਾਂਝੀ ਸਪਲਾਈ ਲਓ',
      tabRequirements: 'ਮੰਗ ਤੇ ਕਿਸਾਨ ਮੇਲ',
      tabPriceLocks: 'ਮੁੱਲ ਲਾਕ (Price Lock)',
      tabFutureDemand: 'ਭਵਿੱਖੀ ਮੰਗ',
      tabBatchTraceability: 'ਬੈਚ ਟਰੇਸਿਬਿਲਟੀ',
      postRequirementBtn: '+ ਨਵੀਂ ਮੰਗ ਪਾਓ',
      requirementsList: 'ਸਰਗਰਮ ਥੋਕ ਮੰਗਾਂ',
      matchedFarmersBadge: 'ਮੇਲ ਖਾਂਦੇ ਕਿਸਾਨ',
      similarityScore: 'ਸਮਾਨਤਾ ਸਕੋਰ',
      farmerPoolingNotice: 'ਵੱਡੇ ਆਰਡਰ ਨੂੰ ਪੂਰਾ ਕਰਨ ਲਈ ਆਸ-ਪਾਸ ਦੇ ਕਈ ਕਿਸਾਨ ਰਲ ਕੇ ਸਪਲਾਈ ਕਰ ਸਕਦੇ ਹਨ।',
      poolSupplyBtn: 'ਸਾਂਝੀ ਸਪਲਾਈ ਦੀ ਸਮੀਖਿਆ',
      approvePoolBtn: 'ਪ੍ਰਵਾਨ ਕਰੋ ਅਤੇ ਸਾਂਝਾ ਆਰਡਰ ਬਣਾਓ',
      createPriceLockBtn: '+ ਅਗੇਤਾ ਮੁੱਲ ਲਾਕ ਭੇਜੋ',
      futureDemandNotice: 'ਅਗਲੇ ਸੀਜ਼ਨ ਲਈ ਆਪਣੀ ਫਸਲ ਦੀ ਮੰਗ ਕਿਸਾਨਾਂ ਨਾਲ ਸਾਂਝੀ ਕਰੋ।',
      postDemandBtn: '+ ਭਵਿੱਖੀ ਮੰਗ ਸਾਂਝੀ ਕਰੋ',
      form: {
        crop: 'ਫਸਲ ਦਾ ਨਾਮ',
        variety: 'ਕਿਸਮ',
        grade: 'ਕੁਆਲਿਟੀ ਗ੍ਰੇਡ',
        quantity: 'ਲੋੜੀਂਦੀ ਮਾਤਰਾ (ਕਿਲੋ)',
        maxPrice: 'ਵੱਧ ਤੋਂ ਵੱਧ ਬਜਟ (₹/ਕਿਲੋ)',
        preferredLocation: 'ਤਰਜੀਹੀ ਇਲਾਕਾ',
        maxDistance: 'ਵੱਧ ਤੋਂ ਵੱਧ ਦੂਰੀ (ਕਿਮੀ)',
        deliveryDate: 'ਡਿਲਿਵਰੀ ਮਿਤੀ',
        notes: 'ਵਿਸ਼ੇਸ਼ ਹਦਾਇਤਾਂ',
        submit: 'ਕਿਸਾਨ ਲੱਭੋ',
      },
    },
    cart: {
      title: 'ਖਰੀਦ ਕਾਰਟ',
      empty: 'ਤੁਹਾਡੀ ਕਾਰਟ ਖਾਲੀ ਹੈ। ਮੰਡੀ ਤੋਂ ਤਾਜ਼ੇ ਲਾਟ ਸ਼ਾਮਲ ਕਰੋ।',
      qty: 'ਮਾਤਰਾ (ਕਿਲੋ)',
      subtotal: 'ਫਸਲ ਉਪ-ਕੁੱਲ',
      mandiCess: 'ਮੰਡੀ ਖਰਚਾ (1.5%)',
      transportEstimate: 'ਅਨੁਮਾਨਿਤ ਕਿਰਾਇਆ',
      grandTotal: 'ਕੁੱਲ ਰਕਮ',
      checkoutBtn: 'ਸੁਰੱਖਿਅਤ ਚੈੱਕਆਊਟ',
      deliveryAddress: 'ਡਿਲਿਵਰੀ ਗੋਦਾਮ ਦਾ ਪਤਾ',
      paymentMethod: 'ਐਸਕਰੋ ਭੁਗਤਾਨ ਵਿਧੀ',
      placeOrder: 'ਆਰਡਰ ਪੱਕਾ ਕਰੋ',
      orderSuccess: '🎉 ਐਸਕਰੋ ਸੁਰੱਖਿਆ ਨਾਲ ਆਰਡਰ ਸਫਲਤਾਪੂਰਵਕ ਦਰਜ ਹੋ ਗਿਆ!',
      escrowGuarantee: 'ਕਿਸਾਨਸੇਤੂ ਐਸਕਰੋ ਗਾਰੰਟੀ: ਮਾਲ ਦੀ ਪਹੁੰਚ ਅਤੇ ਜਾਂਚ ਤੋਂ ਬਾਅਦ ਹੀ ਭੁਗਤਾਨ ਜਾਰੀ ਹੁੰਦਾ ਹੈ।',
    },
    orders: {
      title: 'ਮੇਰੇ ਆਰਡਰ',
      subtitle: 'ਲਾਈਵ ਗੱਡੀ ਟਰੈਕਿੰਗ, ਰਸੀਦਾਂ ਅਤੇ ਮੁਕੰਮਲ ਖਰੀਦ ਦੇਖੋ',
      orderId: 'ਆਰਡਰ ਨੰਬਰ',
      date: 'ਮਿਤੀ',
      farmer: 'ਕਿਸਾਨ',
      crop: 'ਫਸਲ ਤੇ ਕਿਸਮ',
      quantity: 'ਮਾਤਰਾ',
      rate: 'ਦਰ',
      total: 'ਕੁੱਲ ਰਕਮ',
      status: 'ਸਥਿਤੀ',
      tracking: 'ਲਾਈਵ ਗੱਡੀ ਵੇਰਵੇ',
      driver: 'ਡਰਾਈਵਰ',
      vehicle: 'ਗੱਡੀ ਨੰਬਰ',
      viewInvoice: 'ਰਸੀਦ ਡਾਊਨਲੋਡ ਕਰੋ',
      trackOrder: 'ਲਾਈਵ ਟਰੈਕ ਕਰੋ',
    },
    messages: {
      title: 'ਕਿਸਾਨ ਗੱਲਬਾਤ',
      subtitle: 'ਤਸਦੀਕਸ਼ੁਦਾ ਕਿਸਾਨਾਂ ਨਾਲ ਸਿੱਧਾ ਸੰਪਰਕ',
      selectThread: 'ਗੱਲਬਾਤ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਕਿਸਾਨ ਚੁਣੋ',
      typePlaceholder: 'ਕਿਸਾਨ ਨੂੰ ਸੁਨੇਹਾ ਲਿਖੋ...',
      send: 'ਸੁਨੇਹਾ ਭੇਜੋ',
    },
    profile: {
      title: 'ਖਰੀਦਦਾਰ ਪ੍ਰੋਫਾਈਲ',
      subtitle: 'ਕਾਰੋਬਾਰੀ ਵੇਰਵੇ, ਗੋਦਾਮ ਅਤੇ ਖਰੀਦ ਤਰਜੀਹਾਂ ਦਾ ਪ੍ਰਬੰਧਨ ਕਰੋ',
      editBtn: 'ਪ੍ਰੋਫਾਈਲ ਸੋਧੋ',
      saveBtn: 'ਤਬਦੀਲੀਆਂ ਸਾਂਭੋ',
      businessName: 'ਕਾਰੋਬਾਰ ਦਾ ਨਾਮ',
      contactPerson: 'ਸੰਪਰਕ ਵਿਅਕਤੀ',
      businessType: 'ਕਾਰੋਬਾਰ ਦੀ ਕਿਸਮ',
      mobile: 'ਮੋਬਾਈਲ ਨੰਬਰ',
      email: 'ਈਮੇਲ ਪਤਾ',
      gstin: 'GSTIN (ਗੁਪਤ)',
      pan: 'PAN (ਗੁਪਤ)',
      deliveryHub: 'ਮੁੱਖ ਡਿਲਿਵਰੀ ਗੋਦਾਮ',
      preferredCrops: 'ਤਰਜੀਹੀ ਫਸਲਾਂ',
      verifiedBadge: 'ਤਸਦੀਕਸ਼ੁਦਾ ਖਰੀਦਦਾਰ',
    },
  },

  // 4. HARYANVI (हरियाणवी)
  hr: {
    navbar: {
      brandSub: 'क्रेता मंडी',
      searchPlaceholder: 'फसल, किस्म, किसान या गाम/शेहर खोजो...',
      home: 'म्हारा घर',
      browseProduce: 'फसलें देखो',
      myProcurement: 'म्हारी खरीद',
      orders: 'ऑर्डर्स',
      messages: 'संदेश',
      cart: 'झोला (कार्ट)',
      profile: 'प्रोफ़ाइल',
      smartBuy: 'स्मार्ट बाय',
      saveTheHarvest: 'सेव द हार्वेस्ट',
      switchToFarmer: 'किसान पोर्टल पै जाओ',
      logout: 'लॉग आउट',
    },
    topNotification: {
      text: '🌾 थारे इलाके के पक्के किसान भाईयां तै ताज़ा फसल सीधी मिलै सै।',
      learnMore: 'फसलें देखो',
    },
    welcome: {
      greeting: 'राम-राम,',
      subtitle: 'सीधे खेत तै किसान भाईयां की ताज़ा फसल चौखे भाव में खरीदो।',
      buyerRole: 'खरीदार / व्यापारी',
      locationPrefix: '📍',
    },
    quickActions: {
      browseProduce: 'फसलें देखो',
      browseProduceSub: 'सीधे खेत के लॉट देखो',
      postRequirement: 'मांग डालो',
      postRequirementSub: 'किसान भाईयां तै सीधा मिलान',
      smartBuy: 'स्मार्ट बाय',
      smartBuySub: 'मंडी भाव अर सलाह',
      myOrders: 'म्हारे ऑर्डर्स',
      myOrdersSub: 'गाड़ी की लोकेशन देखो',
    },
    categories: {
      all: 'सारी किस्में',
      vegetables: 'सब्जियां',
      fruits: 'फल',
      grains: 'अनाज',
      spices: 'मसाले',
      pulses: 'दालें',
      oilseeds: 'तिलहन',
    },
    heroBanner: {
      badge: 'सीधा खेत तै खरीद',
      title: 'ताज़ा फसल सीधे खेत तै खरीदो',
      subtitle: 'खरे मंडी भाव अर बढ़िया क्वालिटी की फसल बिना बिचौलिए के।',
      cta: 'इबै खरीदो',
      secondaryCta: 'मांग डालो',
    },
    filters: {
      title: 'फ़िल्टर लगाओ',
      apply: 'फ़िल्टर लागू करो',
      clearAll: 'सारे हटाओ',
      location: 'इलाका / राज्य',
      priceRange: 'भाव (₹/किग्रा)',
      category: 'श्रेणी',
      crop: 'फसल',
      variety: 'किस्म',
      qualityGrade: 'क्वालिटी ग्रेड',
      farmer: 'किसान भाई',
      verifiedOnly: 'सिर्फ पक्के सत्यापित किसान',
      minQty: 'कम तै कम वजन',
      allLocations: 'सारे इलाके',
      allCrops: 'सारी फसलें',
      allVarieties: 'सारी किस्में',
      allGrades: 'सारे ग्रेड',
      mobileFilterTitle: 'फ़िल्टर अर क्रम',
      sortBy: 'क्रम बणाओ',
    },
    sorting: {
      recommended: 'सबसे बढ़िया',
      nearestFarmer: 'सबसे धोरे का किसान',
      largestPrice: 'भाव: ज्यादा तै कम',
      lowestPrice: 'भाव: कम तै ज्यादा',
      recentlyAdded: 'नई आई फसल',
    },
    productCard: {
      grade: 'ग्रेड',
      perKg: '/किग्रा',
      available: 'तैयार माल:',
      verifiedFarmer: 'पक्का किसान भाई',
      addToCart: 'झोले में डालो',
      addedToCart: 'डाल दिया ✓',
      viewDetails: 'पूरी बात देखो',
      favorite: 'पसंदीदा',
      minOrder: 'कम तै कम ऑर्डर:',
      timeSensitive: 'जल्दी बिकने वाली फसल',
    },
    sections: {
      shopByProduce: 'फसल छांट कै खरीदो',
      shopByProduceSubtitle: 'किसान भाईयां के खेत तै सीधी ताज़ा फसल',
      featuredFarmers: 'नामचीन किसान भाई',
      topRatedSellers: 'सबसे बढ़िया रेटिंग वाले',
      newFarmEntries: 'नई फसलें',
      saveTheHarvest: 'सेव द हार्वेस्ट ♻️',
      saveTheHarvestSub: 'खराब होण तै बचाण खातर खास छूट पै ताज़ा फसल',
      smartBuyWidgetTitle: '🧠 स्मार्ट बाय मंडी संकेत',
      viewFarmerProfile: 'प्रोफ़ाइल देखो',
      viewBatchQR: 'बैच QR देखो',
      trackBatch: 'इस माल नै ट्रैक करो',
      smartAlternativesTitle: 'दूसरे बढ़िया विकल्प',
      noProductsFound: 'फ़िल्टर के हिसाब तै कोई फसल कोन्या मिली।',
      viewAll: 'सारे देखो',
      recentViews: 'हाल में देखी गई',
      quickOrders: 'लाइव ऑर्डर स्थिति',
      mandiTicker: 'लाइव मंडी भाव',
    },
    smartBuy: {
      title: 'किसानसेतु स्मार्ट बाय सहायक',
      subtitle: 'सरकारी AGMARKNET भाव आधारित सही खरीद सलाह',
      marketSignal: 'मंडी संकेत',
      recommendation: 'सलाह',
      bestTimeToBuy: 'खरीदन का सबसे चौखा टेम',
      currentRate: 'इब का भाव',
      recentAvg: '7 दिन का औसत मंडी रेट',
      fiveDayTrend: 'अगले 5 दिन का अनुमान',
      confidence: 'संकेत की पक्की खबर',
      states: {
        buyNow: 'इबै खरीदो - चौखा भाव',
        consider: 'खरीदन की सोच सको सो',
        wait: 'दाम गिरन का इंतजार करो',
      },
      purchaseOpportunityScore: 'खरीद मौका स्कोर',
      priceWatchTitle: 'भाव अलर्ट (प्राइस वॉच)',
      targetPriceLabel: 'मनचाहा भाव (₹/किग्रा)',
      trackPriceBtn: 'भाव ट्रैक करो',
      trackingActive: 'अलर्ट चालू सै',
      disclaimer: 'यह अनुमान मंडी आवक अर मौसम के आंकड़े देख कै एआई द्वारा बणाया गया सै।',
    },
    procurement: {
      title: 'म्हारी खरीद डेस्क',
      subtitle: 'बड़ा ऑर्डर डालो, पहले तै भाव तय करो अर कई किसान भाईयां तै माल मंगवाओ',
      tabRequirements: 'मांग अर किसान मिलान',
      tabPriceLocks: 'भाव लॉक (Price Lock)',
      tabFutureDemand: 'अगले सीजन की मांग',
      tabBatchTraceability: 'माल की पूरी जांच',
      postRequirementBtn: '+ नई मांग डालो',
      requirementsList: 'चालू थोक मांगें',
      matchedFarmersBadge: 'तैयार किसान भाई',
      similarityScore: 'मिलान स्कोर',
      farmerPoolingNotice: 'बड़ा वजन पूरा करन खातर आसपास के कई किसान भाई मिल कै माल दे सकैं सैं।',
      poolSupplyBtn: 'इकट्ठी सप्लाई देखो',
      approvePoolBtn: 'मंजूर करो अर इकट्ठा ऑर्डर बणाओ',
      createPriceLockBtn: '+ पहले तै भाव तय करण का प्रस्ताव',
      futureDemandNotice: 'अगले सीजन खातर अपणी मांग किसान भाईयां तै साझा करो।',
      postDemandBtn: '+ मांग भेजो',
      form: {
        crop: 'फसल का नाम',
        variety: 'किस्म',
        grade: 'क्वालिटी ग्रेड',
        quantity: 'कितना वजन चाहिए (किग्रा)',
        maxPrice: 'ज्यादा तै ज्यादा बजट (₹/किग्रा)',
        preferredLocation: 'पसंदीदा इलाका',
        maxDistance: 'अधिकतम दूरी (किमी)',
        deliveryDate: 'डिलीवरी की तारीख',
        notes: 'खास निर्देश',
        submit: 'किसान भाई ढूंढो',
      },
    },
    cart: {
      title: 'खरीद झोला (कार्ट)',
      empty: 'थारा झोला खाली सै। मंडी तै ताज़ा फसल जोड़ो।',
      qty: 'वजन (किग्रा)',
      subtotal: 'फसल का रूपया',
      mandiCess: 'मंडी खर्चा व हैंडलिंग (1.5%)',
      transportEstimate: 'अनुमानित भाड़ा',
      grandTotal: 'कुल रूपया',
      checkoutBtn: 'सुरक्षित चेकआउट करो',
      deliveryAddress: 'गोदाम का पता',
      paymentMethod: 'एस्क्रो सुरक्षित भुगतान',
      placeOrder: 'ऑर्डर पक्का करो',
      orderSuccess: '🎉 एस्क्रो सुरक्षा के साथ ऑर्डर पक्का हो ग्या!',
      escrowGuarantee: 'किसानसेतु एस्क्रो गारंटी: माल पहुंचने अर जांच के बाद ही किसान भाई नै भुगतान होवै सै।',
    },
    orders: {
      title: 'म्हारे ऑर्डर्स',
      subtitle: 'लाइव गाड़ी ट्रैकिंग, बिल अर खरीदे गए माल का पूरा हिसाब',
      orderId: 'ऑर्डर नंबर',
      date: 'तारीख',
      farmer: 'किसान भाई',
      crop: 'फसल अर किस्म',
      quantity: 'वजन',
      rate: 'भाव',
      total: 'कुल रूपया',
      status: 'हालत (स्थिति)',
      tracking: 'लाइव गाड़ी की जानकारी',
      driver: 'ड्राइवर',
      vehicle: 'गाड़ी नंबर',
      viewInvoice: 'बिल डाउनलोड करो',
      trackOrder: 'लाइव ट्रैक करो',
    },
    messages: {
      title: 'किसान भाईयां तै बातचीत',
      subtitle: 'सत्यापित किसान भाईयां तै सीधी बात',
      selectThread: 'बातचीत खातर किसान चुणो',
      typePlaceholder: 'किसान भाई नै संदेश लिखो...',
      send: 'संदेश भेजो',
    },
    profile: {
      title: 'व्यापारी प्रोफ़ाइल',
      subtitle: 'अपणे व्यापार, गोदाम अर खरीद की जानकारी संभालो',
      editBtn: 'बदलाव करो',
      saveBtn: 'सेव करो',
      businessName: 'फर्म/दुकान का नाम',
      contactPerson: 'मालिक/संपर्क का नाम',
      businessType: 'व्यापार की किस्म',
      mobile: 'मोबाइल नंबर',
      email: 'ईमेल',
      gstin: 'GSTIN (मास्क्ड)',
      pan: 'PAN (मास्क्ड)',
      deliveryHub: 'मुख्य गोदाम',
      preferredCrops: 'पसंदीदा फसलें',
      verifiedBadge: 'सत्यापित व्यापारी',
    },
  },

  // 5. TELUGU (తెలుగు)
  te: {
    navbar: {
      brandSub: 'కొనుగోలుదారు మార్కెట్',
      searchPlaceholder: 'పంటలు, రకాలు, రైతులు లేదా ప్రాంతాలను శోధించండి...',
      home: 'హోమ్',
      browseProduce: 'పంటలను బ్రౌజ్ చేయండి',
      myProcurement: 'నా సేకరణ',
      orders: 'ఆర్డర్లు',
      messages: 'సందేశాలు',
      cart: 'కార్ట్',
      profile: 'ప్రొఫైల్',
      smartBuy: 'స్మార్ట్ బై',
      saveTheHarvest: 'సేవ్ ది హార్వెస్ట్',
      switchToFarmer: 'రైతు పోర్టల్‌కు మారండి',
      logout: 'లాగ్ అవుట్',
    },
    topNotification: {
      text: '🌾 మీ ప్రాంతంలోని ధృవీకరించిన రైతుల నుండి తాజా పంటలు నేరుగా అందుబాటులో ఉన్నాయి.',
      learnMore: 'పంటలను చూడండి',
    },
    welcome: {
      greeting: 'శుభోదయం,',
      subtitle: 'ధృవీకరించిన రైతుల నుండి నేరుగా తాజా వ్యవసాయ ఉత్పత్తులను పొందండి.',
      buyerRole: 'కొనుగోలుదారు / వ్యాపారి',
      locationPrefix: '📍',
    },
    quickActions: {
      browseProduce: 'పంటలను చూడండి',
      browseProduceSub: 'నేరుగా వ్యవసాయ ఉత్పత్తులను అన్వేషించండి',
      postRequirement: 'అవసరాన్ని పోస్ట్ చేయండి',
      postRequirementSub: 'రైతులతో సరిపోలండి',
      smartBuy: 'స్మార్ట్ బై',
      smartBuySub: 'మార్కెట్ ధరలు & కొనుగోలు సలహా',
      myOrders: 'నా ఆర్డర్లు',
      myOrdersSub: 'లైవ్ డెలివరీని ట్రాక్ చేయండి',
    },
    categories: {
      all: 'అన్ని విభాగాలు',
      vegetables: 'కూరగాయలు',
      fruits: 'పండ్లు',
      grains: 'ధాన్యాలు',
      spices: 'మసాలాలు',
      pulses: 'పప్పులు',
      oilseeds: 'నూనెగింజలు',
    },
    heroBanner: {
      badge: 'నేరుగా పొలం వద్ద కొనుగోలు',
      title: 'తాజా పంటల ప్రత్యక్ష కొనుగోలు',
      subtitle: 'పారదర్శక మార్కెట్ ధరలతో నాణ్యమైన వ్యవసాయ ఉత్పత్తుల వేదిక.',
      cta: 'ఇప్పుడే కొనండి',
      secondaryCta: 'అవసరాన్ని పోస్ట్ చేయండి',
    },
    filters: {
      title: 'ఫిల్టర్ చేయండి',
      apply: 'ఫిల్టర్లను వర్తింపజేయండి',
      clearAll: 'అన్నీ తొలగించండి',
      location: 'ప్రాంతం / రాష్ట్రం',
      priceRange: 'ధర (₹/కిలో)',
      category: 'విభాగం',
      crop: 'పంట',
      variety: 'రకం',
      qualityGrade: 'నాణ్యత గ్రేడ్',
      farmer: 'రైతు',
      verifiedOnly: 'ధృవీకరించిన రైతులు మాత్రమే',
      minQty: 'కనీస లభ్యత పరిమాణం',
      allLocations: 'అన్ని ప్రాంతాలు',
      allCrops: 'అన్ని పంటలు',
      allVarieties: 'అన్ని రకాలు',
      allGrades: 'అన్ని గ్రేడులు',
      mobileFilterTitle: 'ఫిల్టర్ మరియు క్రమబద్ధీకరణ',
      sortBy: 'క్రమబద్ధీకరించు',
    },
    sorting: {
      recommended: 'సిఫార్సు చేయబడినవి',
      nearestFarmer: 'సమీప రైతు (దూరం)',
      largestPrice: 'ధర: ఎక్కువ నుండి తక్కువ',
      lowestPrice: 'ధర: తక్కువ నుండి ఎక్కువ',
      recentlyAdded: 'ఇటీవల చేర్చబడినవి',
    },
    productCard: {
      grade: 'గ్రేడ్',
      perKg: '/కిలో',
      available: 'లభ్యత:',
      verifiedFarmer: 'ధృవీకరించిన రైతు',
      addToCart: 'కార్ట్‌కు జోడించండి',
      addedToCart: 'జోడించబడింది ✓',
      viewDetails: 'వివరాలు చూడండి',
      favorite: 'ఇష్టమైనవి',
      minOrder: 'కనీస ఆర్డర్:',
      timeSensitive: 'తాజా గడువు గల పంట',
    },
    sections: {
      shopByProduce: 'పంట ప్రకారం షాపింగ్ చేయండి',
      shopByProduceSubtitle: 'రైతుల నుండి నేరుగా ధృవీకరించిన పంట లాట్లు',
      featuredFarmers: 'ప్రముఖ రైతులు',
      topRatedSellers: 'టాప్ రేటింగ్ పొందిన విక్రేతలు',
      newFarmEntries: 'కొత్త పంట లిస్టింగ్‌లు',
      saveTheHarvest: 'సేవ్ ది హార్వెస్ట్ ♻️',
      saveTheHarvestSub: 'ఆహార వృధాను తగ్గించడానికి ప్రత్యేక తగ్గింపు ధరలలో తాజా పంటలు',
      smartBuyWidgetTitle: '🧠 స్మార్ట్ బై మార్కెట్ సిగ్నల్స్',
      viewFarmerProfile: 'ప్రొఫైల్ చూడండి',
      viewBatchQR: 'బ్యాచ్ QR చూడండి',
      trackBatch: 'ఈ బ్యాచ్‌ను ట్రాక్ చేయండి',
      smartAlternativesTitle: 'స్మార్ట్ ప్రత్యామ్నాయాలు',
      noProductsFound: 'మీ ఫిల్టర్లకు సరిపోలే పంటలు ఏవీ కనుగొనబడలేదు.',
      viewAll: 'అన్నీ చూడండి',
      recentViews: 'ఇటీవల వీక్షించినవి',
      quickOrders: 'లైవ్ ఆర్డర్ స్థితి',
      mandiTicker: 'లైవ్ మార్కెట్ బెంచ్‌మార్క్',
    },
    smartBuy: {
      title: 'కిసాన్ సేతు స్మార్ట్ బై ఇంజిన్',
      subtitle: 'AGMARKNET డేటా ఆధారిత ఖచ్చితమైన కొనుగోలు విశ్లేషణ',
      marketSignal: 'మార్కెట్ సిగ్నల్',
      recommendation: 'సిఫార్సు',
      bestTimeToBuy: 'కొనుగోలు చేయడానికి ఉత్తమ సమయం',
      currentRate: 'ప్రస్తుత ధర',
      recentAvg: '7 రోజుల మార్కెట్ సగటు',
      fiveDayTrend: '5 రోజుల అంచనా ధోరణి',
      confidence: 'సిగ్నల్ విశ్వసనీయత',
      states: {
        buyNow: 'ఇప్పుడే కొనండి - ఉత్తమ ధర',
        consider: 'కొనుగోలును పరిగణించండి',
        wait: 'ధర తగ్గే వరకు వేచి ఉండండి',
      },
      purchaseOpportunityScore: 'కొనుగోలు అవకాశం స్కోరు',
      priceWatchTitle: 'ధర అలర్ట్ (ప్రైస్ వాచ్)',
      targetPriceLabel: 'లక్ష్య ధర (₹/కిలో)',
      trackPriceBtn: 'ధరను ట్రాక్ చేయండి',
      trackingActive: 'అలర్ట్ సక్రియంగా ఉంది',
      disclaimer: 'ఈ అంచనా మార్కెట్ రాకలు మరియు వాతావరణం ఆధారంగా AI రూపొందించింది.',
    },
    procurement: {
      title: 'సేకరణ కమాండ్ డెస్క్',
      subtitle: 'బల్క్ అవసరాలను పోస్ట్ చేయండి, ధరలను లాక్ చేయండి మరియు సమగ్ర సరఫరాను పొందండి',
      tabRequirements: 'అవసరాలు & సరిపోలిక',
      tabPriceLocks: 'ధర లాక్ (Price Lock)',
      tabFutureDemand: 'భవిష్యత్ డిమాండ్',
      tabBatchTraceability: 'బ్యాచ్ ట్రేసిబిలిటీ',
      postRequirementBtn: '+ అవసరాన్ని పోస్ట్ చేయండి',
      requirementsList: 'క్రియాశీల బల్క్ అవసరాలు',
      matchedFarmersBadge: 'సరిపోలిన రైతులు',
      similarityScore: 'సరిపోలిక స్కోరు',
      farmerPoolingNotice: 'మీ పెద్ద పరిమాణాన్ని పూర్తి చేయడానికి సమీపంలోని పలువురు రైతులు కలిసి సరఫరా చేయవచ్చు.',
      poolSupplyBtn: 'పూల్ సరఫరాను సమీక్షించండి',
      approvePoolBtn: 'ఆమోదించండి & పూల్ ఆర్డర్ సృష్టించండి',
      createPriceLockBtn: '+ ఫార్వర్డ్ ధర లాక్ ఆఫర్ పంపండి',
      futureDemandNotice: 'రాబోయే సీజన్ కోసం మీ పంట డిమాండ్‌ను రైతులతో పంచుకోండి.',
      postDemandBtn: '+ భవిష్యత్ డిమాండ్‌ను పంచుకోండి',
      form: {
        crop: 'పంట పేరు',
        variety: 'రకం',
        grade: 'నాణ్యత గ్రేడ్',
        quantity: 'అవసరమైన పరిమాణం (కిలో)',
        maxPrice: 'గరిష్ట బడ్జెట్ (₹/కిలో)',
        preferredLocation: 'ప్రాధాన్యత ప్రాంతం',
        maxDistance: 'గరిష్ట దూరం (కి.మీ)',
        deliveryDate: 'డెలివరీ తేదీ',
        notes: 'ప్రత్యేక సూచనలు',
        submit: 'రైతులను కనుగొనండి',
      },
    },
    cart: {
      title: 'సేకరణ కార్ట్',
      empty: 'మీ కార్ట్ ఖాళీగా ఉంది. మార్కెట్ నుండి పంటలను జోడించండి.',
      qty: 'పరిమాణం (కిలో)',
      subtotal: 'పంట ఉప మొత్తం',
      mandiCess: 'మార్కెట్ రుసుము (1.5%)',
      transportEstimate: 'రవాణా ఛార్జీల అంచనా',
      grandTotal: 'మొత్తం ఆర్డర్ విలువ',
      checkoutBtn: 'సురక్షిత చెక్అవుట్‌కు వెళ్లండి',
      deliveryAddress: 'డెలివరీ గోదాము చిరునామా',
      paymentMethod: 'ఎస్క్రో చెల్లింపు పద్ధతి',
      placeOrder: 'ఆర్డర్‌ను నిర్ధారించండి',
      orderSuccess: '🎉 ఎస్క్రో భద్రతతో ఆర్డర్ విజయవంతంగా చేయబడింది!',
      escrowGuarantee: 'కిసాన్ సేతు ఎస్క్రో గ్యారెంటీ: పంట డెలివరీ మరియు తనిఖీ తర్వాతే రైతుకు చెల్లింపు విడుదల చేయబడుతుంది.',
    },
    orders: {
      title: 'నా ఆర్డర్లు',
      subtitle: 'లైవ్ రవాణా, ఇన్వాయిస్‌లు మరియు పూర్తి చేసిన ఆర్డర్ల వివరాలు',
      orderId: 'ఆర్డర్ ID',
      date: 'తేదీ',
      farmer: 'రైతు',
      crop: 'పంట & రకం',
      quantity: 'పరిమాణం',
      rate: 'ధర',
      total: 'మొత్తం మొత్తం',
      status: 'స్థితి',
      tracking: 'లైవ్ ట్రాకింగ్ వివరాలు',
      driver: 'డ్రైవర్',
      vehicle: 'వాహనం నంబర్',
      viewInvoice: 'ఇన్వాయిస్ డౌన్‌లోడ్ చేయండి',
      trackOrder: 'లైవ్ ట్రాక్ చేయండి',
    },
    messages: {
      title: 'రైతు సందేశాలు',
      subtitle: 'ధృవీకరించిన రైతులతో ప్రత్యక్ష సంభాషణ',
      selectThread: 'రైతుకు సందేశం పంపడానికి ఎంచుకోండి',
      typePlaceholder: 'రైతుకు సందేశం టైప్ చేయండి...',
      send: 'సందేశం పంపండి',
    },
    profile: {
      title: 'కొనుగోలుదారు ప్రొఫైల్',
      subtitle: 'మీ వ్యాపార వివరాలు, డెలివరీ హబ్‌లు మరియు ప్రాధాన్యతలను నిర్వహించండి',
      editBtn: 'ప్రొఫైల్ సవరించండి',
      saveBtn: 'మార్పులను సేవ్ చేయండి',
      businessName: 'వ్యాపార పేరు',
      contactPerson: 'సంప్రదింపు వ్యక్తి',
      businessType: 'వ్యాపార రకం',
      mobile: 'మొబైల్ నంబర్',
      email: 'ఇమెయిల్ చిరునామా',
      gstin: 'GSTIN (దాచబడింది)',
      pan: 'PAN (దాచబడింది)',
      deliveryHub: 'ప్రధాన డెలివరీ గోదాము',
      preferredCrops: 'ప్రాధాన్యత పంటలు',
      verifiedBadge: 'ధృవీకరించిన కొనుగోలుదారు',
    },
  },

  // 6. TAMIL (தமிழ்)
  ta: {
    navbar: {
      brandSub: 'வாங்குபவர் சந்தை',
      searchPlaceholder: 'பயிர்கள், வகைகள், விவசாயிகள் அல்லது இடங்களைத் தேடுங்கள்...',
      home: 'முகப்பு',
      browseProduce: 'பயிர்களைப் பார்க்கவும்',
      myProcurement: 'என் கொள்முதல்',
      orders: 'ஆர்டர்கள்',
      messages: 'செய்திகள்',
      cart: 'கூடை (கார்ட்)',
      profile: 'சுயவிவரம்',
      smartBuy: 'ஸ்மார்ட் பை',
      saveTheHarvest: 'சேவ் தி ஹார்வெஸ்ட்',
      switchToFarmer: 'விவசாயி தளத்திற்கு மாறவும்',
      logout: 'வெளியேறு',
    },
    topNotification: {
      text: '🌾 உங்கள் பிராந்தியத்தில் சரிபார்க்கப்பட்ட விவசாயிகளிடமிருந்து புதிய பயிர்கள் கிடைக்கின்றன.',
      learnMore: 'பயிர்களைப் பார்க்கவும்',
    },
    welcome: {
      greeting: 'காலை வணக்கம்,',
      subtitle: 'சரிபார்க்கப்பட்ட விவசாயிகளிடமிருந்து நேரடியாக புதிய விளைபொருட்களைப் பெறுங்கள்.',
      buyerRole: 'வாங்குபவர் / வணிகர்',
      locationPrefix: '📍',
    },
    quickActions: {
      browseProduce: 'பயிர்களைப் பார்க்கவும்',
      browseProduceSub: 'நேரடி பண்ணை விளைச்சலை ஆராயுங்கள்',
      postRequirement: 'தேவையை பதிவிடுங்கள்',
      postRequirementSub: 'விவசாயிகளுடன் இணையுங்கள்',
      smartBuy: 'ஸ்மார்ட் பை',
      smartBuySub: 'சந்தை விலை & கொள்முதல் வழிகாட்டல்',
      myOrders: 'என் ஆர்டர்கள்',
      myOrdersSub: 'நேரடி டெலிவரியைக் கண்காணிக்கவும்',
    },
    categories: {
      all: 'அனைத்து வகைகள்',
      vegetables: 'காய்கறிகள்',
      fruits: 'பழங்கள்',
      grains: 'தானியங்கள்',
      spices: 'மசாலாப் பொருட்கள்',
      pulses: 'பருப்பு வகைகள்',
      oilseeds: 'எண்ணெய் வித்துக்கள்',
    },
    heroBanner: {
      badge: 'நேரடி பண்ணை கொள்முதல்',
      title: 'புதிய அறுவடைகளின் நேரடி கொள்முதல்',
      subtitle: 'வெளிப்படையான மண்டி விலைகளுடன் தரமான விவசாய விளைபொருட்களின் நவீன சந்தை.',
      cta: 'இப்போதே வாங்கவும்',
      secondaryCta: 'தேவையை பதிவிடவும்',
    },
    filters: {
      title: 'வடிகட்டுதல்',
      apply: 'வடிகட்டிகளைப் பயன்படுத்து',
      clearAll: 'அனைத்தையும் நீக்கு',
      location: 'இடம் / மாநிலம்',
      priceRange: 'விலை (₹/கிலோ)',
      category: 'வகை',
      crop: 'பயிர்',
      variety: 'ரகம்',
      qualityGrade: 'தர நிலை',
      farmer: 'விவசாயி',
      verifiedOnly: 'சரிபார்க்கப்பட்ட விவசாயிகள் மட்டும்',
      minQty: 'குறைந்தபட்ச அளவு',
      allLocations: 'அனைத்து இடங்கள்',
      allCrops: 'அனைத்து பயிர்கள்',
      allVarieties: 'அனைத்து ரகங்கள்',
      allGrades: 'அனைத்து தரங்கள்',
      mobileFilterTitle: 'வடிகட்டிகள் & வரிசைப்படுத்துதல்',
      sortBy: 'வரிசைப்படுத்து',
    },
    sorting: {
      recommended: 'பரிந்துரைக்கப்பட்டவை',
      nearestFarmer: 'அருகிலுள்ள விவசாயி (தொலைவு)',
      largestPrice: 'விலை: அதிகம் முதல் குறைவு',
      lowestPrice: 'விலை: குறைவு முதல் அதிகம்',
      recentlyAdded: 'சமீபத்தில் சேர்க்கப்பட்டவை',
    },
    productCard: {
      grade: 'தரம்',
      perKg: '/கிலோ',
      available: 'இருப்பு:',
      verifiedFarmer: 'சரிபார்க்கப்பட்ட விவசாயி',
      addToCart: 'கூடையில் சேர்',
      addedToCart: 'சேர்க்கப்பட்டது ✓',
      viewDetails: 'விவரங்களைக் காண்க',
      favorite: 'விருப்பமானது',
      minOrder: 'குறைந்தபட்ச ஆர்டர்:',
      timeSensitive: 'விரைவில் வாங்க வேண்டிய பயிர்',
    },
    sections: {
      shopByProduce: 'பயிர் வாரியாக வாங்கவும்',
      shopByProduceSubtitle: 'விவசாயிகளிடமிருந்து நேரடியாக சரிபார்க்கப்பட்ட விளைபொருட்கள்',
      featuredFarmers: 'முக்கிய விவசாயிகள்',
      topRatedSellers: 'சிறந்த விற்பனையாளர்கள்',
      newFarmEntries: 'புதிய பண்ணைப் பட்டியல்கள்',
      saveTheHarvest: 'சேவ் தி ஹார்வெஸ்ட் ♻️',
      saveTheHarvestSub: 'உணவு வீணாவதைத் தடுக்க தள்ளுபடி விலையில் புதிய அறுவடைகள்',
      smartBuyWidgetTitle: '🧠 ஸ்மார்ட் பை சந்தை சிக்னல்கள்',
      viewFarmerProfile: 'சுயவிவரத்தைக் காண்க',
      viewBatchQR: 'தொகுதி QR ஐக் காண்க',
      trackBatch: 'இந்த தொகுதியைக் கண்காணிக்கவும்',
      smartAlternativesTitle: 'சிறந்த மாற்றுகள்',
      noProductsFound: 'உங்கள் வடிகட்டலுக்கு பொருந்தும் பயிர்கள் எதுவும் கிடைக்கவில்லை.',
      viewAll: 'அனைத்தையும் காண்க',
      recentViews: 'சமீபத்தில் பார்த்தவை',
      quickOrders: 'நேரடி ஆர்டர் நிலை',
      mandiTicker: 'நேரடி மண்டி விலை நிலவரம்',
    },
    smartBuy: {
      title: 'கிசான் சேது ஸ்மார்ட் பை தளம்',
      subtitle: 'AGMARKNET அரசுத் தரவு அடிப்படையிலான கொள்முதல் பகுப்பாய்வு',
      marketSignal: 'சந்தை சிக்னல்',
      recommendation: 'பரிந்துரை',
      bestTimeToBuy: 'வாங்க சிறந்த நேரம்',
      currentRate: 'தற்போதைய விலை',
      recentAvg: '7 நாள் மண்டி சராசரி',
      fiveDayTrend: '5 நாள் போக்கு கணிப்பு',
      confidence: 'சிக்னல் நம்பகத்தன்மை',
      states: {
        buyNow: 'இப்போதே வாங்கவும் - சிறந்த விலை',
        consider: 'வாங்குவதைப் பரிசீலிக்கவும்',
        wait: 'விலை குறையும் வரை காத்திருக்கவும்',
      },
      purchaseOpportunityScore: 'கொள்முதல் வாய்ப்பு மதிப்பெண்',
      priceWatchTitle: 'விலை எச்சரிக்கை (பிரைஸ் வாட்ச்)',
      targetPriceLabel: 'இலக்கு விலை (₹/கிலோ)',
      trackPriceBtn: 'விலையைக் கண்காணிக்கவும்',
      trackingActive: 'எச்சரிக்கை செயலில் உள்ளது',
      disclaimer: 'இந்த கணிப்பு மண்டி வரத்து மற்றும் வானிலை அடிப்படையில் AI ஆல் உருவாக்கப்பட்டது.',
    },
    procurement: {
      title: 'கொள்முதல் மேலாண்மை மையம்',
      subtitle: 'மொத்தத் தேவைகளைப் பதிவு செய்யவும், முன்கூட்டியே விலையை நிர்ணயிக்கவும்',
      tabRequirements: 'தேவைகள் & பொருத்தம்',
      tabPriceLocks: 'விலை நிர்ணயம் (Price Lock)',
      tabFutureDemand: 'எதிர்கால தேவை',
      tabBatchTraceability: 'தொகுதி கண்காணிப்பு',
      postRequirementBtn: '+ தேவையை பதிவிடவும்',
      requirementsList: 'செயலில் உள்ள மொத்த தேவைகள்',
      matchedFarmersBadge: 'பொருந்திய விவசாயிகள்',
      similarityScore: 'பொருத்த மதிப்பெண்',
      farmerPoolingNotice: 'உங்கள் பெரிய தேவையைப் பூர்த்தி செய்ய அருகிலுள்ள பல விவசாயிகள் இணைந்து வழங்கலாம்.',
      poolSupplyBtn: 'கூட்டு விநியோகத்தை மதிப்பாய்வு செய்க',
      approvePoolBtn: 'ஏற்று கூட்டு ஆர்டரை உருவாக்கவும்',
      createPriceLockBtn: '+ முன்கூட்டிய விலை சலுகையை அனுப்பவும்',
      futureDemandNotice: 'அடுத்த பருவத்திற்கான உங்கள் பயிர் தேவையை விவசாயிகளுடன் பகிர்ந்து கொள்ளுங்கள்.',
      postDemandBtn: '+ எதிர்கால தேவையைப் பகிரவும்',
      form: {
        crop: 'பயிர் பெயர்',
        variety: 'ரகம்',
        grade: 'தர நிலை',
        quantity: 'தேவையான அளவு (கிலோ)',
        maxPrice: 'அதிகபட்ச விலை (₹/கிலோ)',
        preferredLocation: 'விருப்பமான இடம்',
        maxDistance: 'அதிகபட்ச தூரம் (கிமீ)',
        deliveryDate: 'டெலிவரி தேதி',
        notes: 'சிறப்பு குறிப்புகள்',
        submit: 'விவசாயிகளைக் கண்டறியவும்',
      },
    },
    cart: {
      title: 'கொள்முதல் கூடை',
      empty: 'உங்கள் கூடை காலியாக உள்ளது. சந்தையிலிருந்து பயிர்களைச் சேர்க்கவும்.',
      qty: 'அளவு (கிலோ)',
      subtotal: 'பயிர் மொத்தம்',
      mandiCess: 'சந்தைக் கட்டணம் (1.5%)',
      transportEstimate: 'போக்குவரத்து கட்டண மதிப்பீடு',
      grandTotal: 'மொத்த ஆர்டர் தொகை',
      checkoutBtn: 'பாதுகாப்பான செக்அவுட்',
      deliveryAddress: 'டெலிவரி கிடங்கு முகவரி',
      paymentMethod: 'எஸ்க்ரோ கட்டண முறை',
      placeOrder: 'ஆர்டரை உறுதிப்படுத்துக',
      orderSuccess: '🎉 எஸ்க்ரோ பாதுகாப்புடன் ஆர்டர் வெற்றிகரமாக பதிவு செய்யப்பட்டது!',
      escrowGuarantee: 'கிசான் சேது எஸ்க்ரோ உத்தரவாதம்: பயிர் சரிபார்ப்பு மற்றும் டெலிவரிக்குப் பிறகே விவசாயிக்கு பணம் வழங்கப்படும்.',
    },
    orders: {
      title: 'என் ஆர்டர்கள்',
      subtitle: 'நேரடி போக்குவரத்து, ரசீதுகள் மற்றும் நிறைவுற்ற கொள்முதல் விவரங்கள்',
      orderId: 'ஆர்டர் எண்',
      date: 'தேதி',
      farmer: 'விவசாயி',
      crop: 'பயிர் & ரகம்',
      quantity: 'அளவு',
      rate: 'விலை',
      total: 'மொத்தத் தொகை',
      status: 'நிலை',
      tracking: 'நேரடி வாகன கண்காணிப்பு',
      driver: 'ஓட்டுநர்',
      vehicle: 'வாகன எண்',
      viewInvoice: 'ரசீதை பதிவிறக்கவும்',
      trackOrder: 'நேரடியாக கண்காணிக்கவும்',
    },
    messages: {
      title: 'விவசாயி உரையாடல்',
      subtitle: 'சரிபார்க்கப்பட்ட விவசாயிகளுடன் நேரடி தொடர்பு',
      selectThread: 'உரையாடலைத் தொடங்க விவசாயியைத் தேர்ந்தெடுக்கவும்',
      typePlaceholder: 'விவசாயிக்கு செய்தி அனுப்பவும்...',
      send: 'செய்தி அனுப்பு',
    },
    profile: {
      title: 'வணிக சுயவிவரம்',
      subtitle: 'உங்கள் வணிக விவரங்கள், கிடங்கு மற்றும் கொள்முதல் விருப்பங்களை நிர்வகிக்கவும்',
      editBtn: 'சுயவிவரத்தைத் திருத்து',
      saveBtn: 'மாற்றங்களைச் சேமி',
      businessName: 'வணிகப் பெயர்',
      contactPerson: 'தொடர்பு நபர்',
      businessType: 'வணிக வகை',
      mobile: 'கைபேசி எண்',
      email: 'மின்னஞ்சல் முகவரி',
      gstin: 'GSTIN (மறைக்கப்பட்டது)',
      pan: 'PAN (மறைக்கப்பட்டது)',
      deliveryHub: 'முக்கிய டெலிவரி கிடங்கு',
      preferredCrops: 'விருப்பமான பயிர்கள்',
      verifiedBadge: 'சரிபார்க்கப்பட்ட வணிக வாங்குபவர்',
    },
  },
};
