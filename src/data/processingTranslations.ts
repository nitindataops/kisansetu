import { LanguageCode } from '../types';

export interface ProcessingTranslations {
  moduleTitle: string;
  moduleSubtitle: string;
  tabs: {
    postHarvest: string;
    storage: string;
    mills: string;
  };
  analytics: {
    rawProcessed: string;
    outputProduced: string;
    processingLoss: string;
    avgYield: string;
    activeProducts: string;
    valueAddedRevenue: string;
    netGain: string;
  };
  filter: {
    allProduce: string;
    rawProduce: string;
    processedProduce: string;
    produceType: string;
  };
  stages: {
    RAW_AVAILABLE: string;
    PROCESSING_PLANNED: string;
    PROCESSING_IN_PROGRESS: string;
    PROCESSED_AVAILABLE: string;
    SOLD: string;
  };
  form: {
    startProcessingBtn: string;
    modalTitle: string;
    modalSubtitle: string;
    selectCropLabel: string;
    availableRawLabel: string;
    selectProcessingTypeLabel: string;
    inputQtyLabel: string;
    outputQtyLabel: string;
    yieldLabel: string;
    lossLabel: string;
    processingCostLabel: string;
    sellingPriceLabel: string;
    packagingLabel: string;
    productNameLabel: string;
    productGradeLabel: string;
    processingPartnerLabel: string;
    selfProcessingOption: string;
    partnerMillOption: string;
    selectPartnerMillLabel: string;
    economicsHeading: string;
    rawValEstimate: string;
    processedGrossEstimate: string;
    netValueGainEstimate: string;
    publishCheckboxLabel: string;
    submitBtn: string;
    cancelBtn: string;
  };
  cards: {
    processedBadge: string;
    rawBadge: string;
    processedFrom: string;
    processingMethod: string;
    batchId: string;
    yield: string;
    markCompleted: string;
    publishMarketplace: string;
    viewBatchTrace: string;
    partnerFacility: string;
  };
  aiInsight: {
    title: string;
    badge: string;
    disclaimer: string;
  };
}

export const processingTranslations: Record<LanguageCode, ProcessingTranslations> = {
  hi: {
    moduleTitle: 'पोस्ट-हार्वेस्ट प्रसंस्करण एवं मूल्य संवर्धन',
    moduleSubtitle: 'कच्ची फसल को सीधे कम दाम में बेचने के बजाय प्रसंस्करण (आटा, तेल, दाल, पल्प) कर 25-40% अधिक आय प्राप्त करें।',
    tabs: {
      postHarvest: 'पोस्ट-हार्वेस्ट एवं मूल्य संवर्धन',
      storage: 'कोल्ड स्टोरेज एवं वेयरहाउस',
      mills: 'साझेदार मिल एवं प्रसंस्करण केंद्र',
    },
    analytics: {
      rawProcessed: 'कुल प्रसंस्कृत कच्चा माल',
      outputProduced: 'तैयार मूल्य संवर्धित उत्पाद',
      processingLoss: 'प्रसंस्करण क्षय (लॉस)',
      avgYield: 'औसत रिकवरी (यील्ड)',
      activeProducts: 'सक्रिय प्रसंस्कृत उत्पाद',
      valueAddedRevenue: 'मूल्य संवर्धित बिक्री राजस्व',
      netGain: 'अनुमानित शुद्ध मूल्य लाभ',
    },
    filter: {
      allProduce: 'सभी कृषि उत्पाद',
      rawProduce: 'कच्ची कृषि उपज',
      processedProduce: 'प्रसंस्कृत / मूल्य संवर्धित',
      produceType: 'उत्पाद प्रकार',
    },
    stages: {
      RAW_AVAILABLE: 'कच्चा स्टॉक उपलब्ध',
      PROCESSING_PLANNED: 'प्रसंस्करण नियोजित',
      PROCESSING_IN_PROGRESS: 'प्रसंस्करण प्रगति पर',
      PROCESSED_AVAILABLE: 'तैयार उत्पाद (बिक्री हेतु)',
      SOLD: 'पूर्णतः विक्रय',
    },
    form: {
      startProcessingBtn: '+ नया प्रसंस्करण शुरू करें',
      modalTitle: 'नई पोस्ट-हार्वेस्ट प्रसंस्करण इकाई जोड़ें',
      modalSubtitle: 'कच्चे स्टॉक को प्रसंस्कृत मूल्य संवर्धित उत्पाद में बदलें और सीधे मंडी/खरीदार तक पहुंचाएं।',
      selectCropLabel: 'कच्ची फसल / इन्वेंट्री चुनें',
      availableRawLabel: 'उपलब्ध कच्चा स्टॉक',
      selectProcessingTypeLabel: 'प्रसंस्करण / रूपांतरण विधि',
      inputQtyLabel: 'प्रसंस्करण हेतु भेजी जाने वाली मात्रा (किग्रा)',
      outputQtyLabel: 'अनुमानित तैयार उत्पाद मात्रा (किग्रा)',
      yieldLabel: 'रिकवरी (यील्ड %)',
      lossLabel: 'प्रसंस्करण क्षय (किग्रा)',
      processingCostLabel: 'कुल प्रसंस्करण लागत (₹)',
      sellingPriceLabel: 'लक्षित विक्रय मूल्य (₹ प्रति किग्रा)',
      packagingLabel: 'पैकेजिंग प्रकार',
      productNameLabel: 'तैयार उत्पाद का नाम',
      productGradeLabel: 'गुणवत्ता ग्रेड',
      processingPartnerLabel: 'प्रसंस्करण व्यवस्था',
      selfProcessingOption: 'स्वयं प्रसंस्करण (ऑन-फार्म / निजी चक्की-कोल्हू)',
      partnerMillOption: 'साझेदार मिल / प्रसंस्करण इकाई (कस्टम मिलिंग)',
      selectPartnerMillLabel: 'साझेदार मिल चुनें',
      economicsHeading: 'मूल्य संवर्धन का आर्थिक विश्लेषण (अनुमानित)',
      rawValEstimate: 'कच्चे माल का मूल्य',
      processedGrossEstimate: 'तैयार उत्पाद का सकल मूल्य',
      netValueGainEstimate: 'शुद्ध अनुमानित मूल्य वृद्धि',
      publishCheckboxLabel: 'प्रसंस्करण पूर्ण होते ही खरीदार मार्केटप्लेस में प्रकाशित करें',
      submitBtn: 'प्रसंस्करण शुरू करें एवं इन्वेंट्री सुरक्षित करें',
      cancelBtn: 'रद्द करें',
    },
    cards: {
      processedBadge: 'प्रसंस्कृत उत्पाद',
      rawBadge: 'कच्ची उपज',
      processedFrom: 'मूल कच्ची फसल',
      processingMethod: 'प्रसंस्करण विधि',
      batchId: 'प्रसंस्करण बैच',
      yield: 'यील्ड / रिकवरी',
      markCompleted: 'प्रसंस्करण पूर्ण चिह्नित करें',
      publishMarketplace: 'मार्केटप्लेस में लाइव करें',
      viewBatchTrace: 'ट्रेसेबिलिटी देखें',
      partnerFacility: 'प्रसंस्करण इकाई',
    },
    aiInsight: {
      title: 'किसानसेतु AI प्रसंस्करण एवं मूल्य संवर्धन परामर्श',
      badge: 'AI अंतर्दृष्टि',
      disclaimer: 'यह विश्लेषण वास्तविक उपज एवं अनुमानित मंडी दरों पर आधारित सूचनात्मक परामर्श है।',
    },
  },

  en: {
    moduleTitle: 'Post-Harvest Processing & Value Addition',
    moduleSubtitle: 'Transform raw crops into value-added produce (flour, oil, split dal, puree) to increase farmer earnings by 25-40%.',
    tabs: {
      postHarvest: 'Post-Harvest & Processing',
      storage: 'Cold Storages & Warehouses',
      mills: 'Partner Mills & Processors',
    },
    analytics: {
      rawProcessed: 'Total Raw Produce Processed',
      outputProduced: 'Processed Value-Added Output',
      processingLoss: 'Processing Loss',
      avgYield: 'Average Yield Recovery',
      activeProducts: 'Active Processed Products',
      valueAddedRevenue: 'Value-Added Sales Revenue',
      netGain: 'Estimated Net Value Gain',
    },
    filter: {
      allProduce: 'All Agricultural Produce',
      rawProduce: 'Raw Farm Harvest',
      processedProduce: 'Processed / Value-Added',
      produceType: 'Produce Type',
    },
    stages: {
      RAW_AVAILABLE: 'Raw Stock Available',
      PROCESSING_PLANNED: 'Processing Planned',
      PROCESSING_IN_PROGRESS: 'Processing In Progress',
      PROCESSED_AVAILABLE: 'Available for Sale',
      SOLD: 'Completely Sold',
    },
    form: {
      startProcessingBtn: '+ Start Value Addition',
      modalTitle: 'Initiate Post-Harvest Processing',
      modalSubtitle: 'Convert on-farm raw inventory into high-value processed commodities with guaranteed batch traceability.',
      selectCropLabel: 'Select Raw Crop Inventory',
      availableRawLabel: 'Available Raw Stock',
      selectProcessingTypeLabel: 'Processing / Transformation Type',
      inputQtyLabel: 'Raw Quantity for Processing (kg)',
      outputQtyLabel: 'Expected Processed Output (kg)',
      yieldLabel: 'Yield Recovery (%)',
      lossLabel: 'Processing Loss (kg)',
      processingCostLabel: 'Total Processing Cost (₹)',
      sellingPriceLabel: 'Target Selling Price (₹/kg)',
      packagingLabel: 'Packaging Unit / Type',
      productNameLabel: 'Processed Product Name',
      productGradeLabel: 'Quality Grade',
      processingPartnerLabel: 'Processing Facility Setup',
      selfProcessingOption: 'On-Farm / Self-Machinery Processing',
      partnerMillOption: 'Registered Partner Mill / Processing Center',
      selectPartnerMillLabel: 'Select Partner Mill',
      economicsHeading: 'Value-Addition Economics Forecast',
      rawValEstimate: 'Raw Material Baseline Value',
      processedGrossEstimate: 'Processed Gross Realization',
      netValueGainEstimate: 'Estimated Net Value Addition Gain',
      publishCheckboxLabel: 'Publish directly to Buyer Marketplace upon completion',
      submitBtn: 'Confirm & Reserve Raw Inventory',
      cancelBtn: 'Cancel',
    },
    cards: {
      processedBadge: 'Processed Produce',
      rawBadge: 'Raw Farm Harvest',
      processedFrom: 'Original Raw Crop',
      processingMethod: 'Processing Method',
      batchId: 'Batch Lineage ID',
      yield: 'Output Yield',
      markCompleted: 'Mark Processing Completed',
      publishMarketplace: 'Publish to Marketplace',
      viewBatchTrace: 'Trace Lineage',
      partnerFacility: 'Processing Facility',
    },
    aiInsight: {
      title: 'KisanSetu AI Post-Harvest Value Addition Insights',
      badge: 'AI Heuristic Insight',
      disclaimer: 'Calculated using typical commodity recovery metrics and live APMC price spreads. Provided for educational guidance.',
    },
  },

  pa: {
    moduleTitle: 'ਪੋਸਟ-ਹਾਰਵੈਸਟ ਪ੍ਰੋਸੈਸਿੰਗ ਅਤੇ ਮੁੱਲ ਵਾਧਾ',
    moduleSubtitle: 'ਕੱਚੀ ਫ਼ਸਲ ਨੂੰ ਸਿੱਧਾ ਘੱਟ ਰੇਟ ਤੇ ਵੇਚਣ ਦੀ ਬਜਾਏ ਆਟਾ, ਤੇਲ, ਦਾਲ ਬਣਾ ਕੇ 25-40% ਵੱਧ ਮੁਨਾਫ਼ਾ ਕਮਾਓ।',
    tabs: {
      postHarvest: 'ਪੋਸਟ-ਹਾਰਵੈਸਟ ਤੇ ਪ੍ਰੋਸੈਸਿੰਗ',
      storage: 'ਕੋਲਡ ਸਟੋਰੇਜ ਅਤੇ ਗੁਦਾਮ',
      mills: 'ਸਾਂਝੇਦਾਰ ਮਿੱਲਾਂ ਤੇ ਪ੍ਰੋਸੈਸਰ',
    },
    analytics: {
      rawProcessed: 'ਕੁੱਲ ਪ੍ਰੋਸੈਸ ਕੱਚਾ ਮਾਲ',
      outputProduced: 'ਤਿਆਰ ਪ੍ਰੋਸੈਸਡ ਉਤਪਾਦ',
      processingLoss: 'ਪ੍ਰੋਸੈਸਿੰਗ ਖ਼ਸਾਰਾ',
      avgYield: 'ਔਸਤ ਰਿਕਵਰੀ',
      activeProducts: 'ਸਰਗਰਮ ਉਤਪਾਦ',
      valueAddedRevenue: 'ਮੁੱਲ ਵਾਧਾ ਵਿਕਰੀ ਆਮਦਨ',
      netGain: 'ਅਨੁਮਾਨਿਤ ਸ਼ੁੱਧ ਲਾਭ',
    },
    filter: {
      allProduce: 'ਸਾਰੇ ਉਤਪਾਦ',
      rawProduce: 'ਕੱਚੀ ਫ਼ਸਲ',
      processedProduce: 'ਪ੍ਰੋਸੈਸਡ / ਮੁੱਲ ਵਾਧਾ',
      produceType: 'ਉਤਪਾਦ ਕਿਸਮ',
    },
    stages: {
      RAW_AVAILABLE: 'ਕੱਚਾ ਸਟਾਕ ਮੌਜੂਦ',
      PROCESSING_PLANNED: 'ਪ੍ਰੋਸੈਸਿੰਗ ਯੋਜਨਾਬੱਧ',
      PROCESSING_IN_PROGRESS: 'ਪ੍ਰੋਸੈਸਿੰਗ ਚੱਲ ਰਹੀ ਹੈ',
      PROCESSED_AVAILABLE: 'ਵਿਕਰੀ ਲਈ ਤਿਆਰ',
      SOLD: 'ਸਾਰਾ ਵਿਕ ਗਿਆ',
    },
    form: {
      startProcessingBtn: '+ ਨਵੀਂ ਪ੍ਰੋਸੈਸਿੰਗ ਸ਼ੁਰੂ ਕਰੋ',
      modalTitle: 'ਪੋਸਟ-ਹਾਰਵੈਸਟ ਪ੍ਰੋਸੈਸਿੰਗ ਸ਼ੁਰੂ ਕਰੋ',
      modalSubtitle: 'ਕੱਚੇ ਸਟਾਕ ਨੂੰ ਉੱਚ-ਮੁੱਲ ਉਤਪਾਦ ਵਿੱਚ ਬਦਲੋ।',
      selectCropLabel: 'ਕੱਚੀ ਫ਼ਸਲ ਚੁਣੋ',
      availableRawLabel: 'ਉਪਲਬਧ ਸਟਾਕ',
      selectProcessingTypeLabel: 'ਪ੍ਰੋਸੈਸਿੰਗ ਕਿਸਮ',
      inputQtyLabel: 'ਪ੍ਰੋਸੈਸਿੰਗ ਮਾਤਰਾ (ਕਿਲੋ)',
      outputQtyLabel: 'ਅਨੁਮਾਨਿਤ ਆਊਟਪੁੱਟ (ਕਿਲੋ)',
      yieldLabel: 'ਰਿਕਵਰੀ (%)',
      lossLabel: 'ਖ਼ਸਾਰਾ (ਕਿਲੋ)',
      processingCostLabel: 'ਕੁੱਲ ਲਾਗਤ (₹)',
      sellingPriceLabel: 'ਵਿਕਰੀ ਮੁੱਲ (₹/ਕਿਲੋ)',
      packagingLabel: 'ਪੈਕਿੰਗ ਕਿਸਮ',
      productNameLabel: 'ਉਤਪਾਦ ਦਾ ਨਾਂ',
      productGradeLabel: 'ਕੁਆਲਿਟੀ ਗ੍ਰੇਡ',
      processingPartnerLabel: 'ਪ੍ਰੋਸੈਸਿੰਗ ਪ੍ਰਬੰਧ',
      selfProcessingOption: 'ਆਪਣੀ ਚੱਕੀ / ਪ੍ਰੋਸੈਸਿੰਗ',
      partnerMillOption: 'ਸਾਂਝੇਦਾਰ ਮਿੱਲ',
      selectPartnerMillLabel: 'ਮਿੱਲ ਚੁਣੋ',
      economicsHeading: 'ਮੁੱਲ ਵਾਧਾ ਮੁਨਾਫ਼ਾ ਅਨੁਮਾਨ',
      rawValEstimate: 'ਕੱਚੇ ਮਾਲ ਦਾ ਮੁੱਲ',
      processedGrossEstimate: 'ਤਿਆਰ ਉਤਪਾਦ ਦਾ ਕੁੱਲ ਮੁੱਲ',
      netValueGainEstimate: 'ਸ਼ੁੱਧ ਮੁੱਲ ਲਾਭ',
      publishCheckboxLabel: 'ਮਾਰਕਿਟਪਲੇਸ ਵਿੱਚ ਪ੍ਰਕਾਸ਼ਿਤ ਕਰੋ',
      submitBtn: 'ਤਸਦੀਕ ਕਰੋ ਤੇ ਸਟਾਕ ਰਾਖਵਾਂ ਕਰੋ',
      cancelBtn: 'ਰੱਦ ਕਰੋ',
    },
    cards: {
      processedBadge: 'ਪ੍ਰੋਸੈਸਡ ਉਤਪਾਦ',
      rawBadge: 'ਕੱਚੀ ਫ਼ਸਲ',
      processedFrom: 'ਮੂਲ ਫ਼ਸਲ',
      processingMethod: 'ਪ੍ਰੋਸੈਸਿੰਗ ਤਰੀਕਾ',
      batchId: 'ਬੈਚ ਆਈਡੀ',
      yield: 'ਰਿਕਵਰੀ ਝਾੜ',
      markCompleted: 'ਮੁਕੰਮਲ ਚਿੰਨ੍ਹਿਤ ਕਰੋ',
      publishMarketplace: 'ਮਾਰਕਿਟ ਵਿੱਚ ਪਾਓ',
      viewBatchTrace: 'ਟਰੇਸੇਬਿਲਟੀ ਦੇਖੋ',
      partnerFacility: 'ਪ੍ਰੋਸੈਸਿੰਗ ਯੂਨਿਟ',
    },
    aiInsight: {
      title: 'ਕਿਸਾਨਸੇਤੂ AI ਮੁੱਲ ਵਾਧਾ ਸਲਾਹ',
      badge: 'AI ਸਲਾਹ',
      disclaimer: 'ਇਹ ਅੰਦਾਜ਼ਾ ਪ੍ਰਚਲਿਤ ਮੰਡੀ ਦਰਾਂ ਤੇ ਆਧਾਰਿਤ ਹੈ।',
    },
  },

  hr: {
    moduleTitle: 'पोस्ट-हार्वेस्ट प्रोसेसिंग अर मूल्य संवर्धन',
    moduleSubtitle: 'कच्ची फसल नै सीधे मंदी बेचन की बजाए आटा, तेल, दाल बणा कै 25-40% घणा नफा कमाओ।',
    tabs: {
      postHarvest: 'पोस्ट-हार्वेस्ट अर प्रोसेसिंग',
      storage: 'कोल्ड स्टोरेज अर गोदाम',
      mills: 'साझेदार मिल अर प्रोसेसिंग केंद्र',
    },
    analytics: {
      rawProcessed: 'कुल प्रोसेस्ड कच्चा माल',
      outputProduced: 'तैयार प्रोसेस्ड उत्पाद',
      processingLoss: 'प्रोसेसिंग नुकसान',
      avgYield: 'औसत रिकवरी',
      activeProducts: 'चालू उत्पाद',
      valueAddedRevenue: 'संवर्धित बिक्री कमाई',
      netGain: 'अनुमानित शुद्ध फायदा',
    },
    filter: {
      allProduce: 'सारे उत्पाद',
      rawProduce: 'कच्ची फसल',
      processedProduce: 'प्रोसेस्ड / मूल्य संवर्धित',
      produceType: 'उत्पाद प्रकार',
    },
    stages: {
      RAW_AVAILABLE: 'कच्चा माल मौजूद',
      PROCESSING_PLANNED: 'प्रोसेसिंग की योजना',
      PROCESSING_IN_PROGRESS: 'काम चालू सै',
      PROCESSED_AVAILABLE: 'बिक्री खातर तैयार',
      SOLD: 'पूरा बिकग्या',
    },
    form: {
      startProcessingBtn: '+ नई प्रोसेसिंग शुरू करो',
      modalTitle: 'पोस्ट-हार्वेस्ट प्रोसेसिंग जोड़ो',
      modalSubtitle: 'कच्ची फसल तै तैयार उत्पाद बणाओ अर खरीदार तक पहुंचाओ।',
      selectCropLabel: 'कच्ची फसल चुणो',
      availableRawLabel: 'उपलब्ध कच्चा स्टॉक',
      selectProcessingTypeLabel: 'प्रोसेसिंग का तरीका',
      inputQtyLabel: 'प्रोसेसिंग खातर मात्रा (किलो)',
      outputQtyLabel: 'अनुमानित तैयार माल (किलो)',
      yieldLabel: 'रिकवरी (%)',
      lossLabel: 'नुकसान (किलो)',
      processingCostLabel: 'कुल खर्चा (₹)',
      sellingPriceLabel: 'बेचन का भाव (₹/किलो)',
      packagingLabel: 'पैकिंग का तरीका',
      productNameLabel: 'तैयार उत्पाद का नाम',
      productGradeLabel: 'क्वालिटी ग्रेड',
      processingPartnerLabel: 'कदे प्रोसेसिंग होगी',
      selfProcessingOption: 'खुद की चक्की पै',
      partnerMillOption: 'साझेदार मिल पै',
      selectPartnerMillLabel: 'मिल चुणो',
      economicsHeading: 'नफा-नुकसान का हिसाब',
      rawValEstimate: 'कच्चे माल का मोल',
      processedGrossEstimate: 'तैयार माल का कुल मोल',
      netValueGainEstimate: 'शुद्ध बचत व फायदा',
      publishCheckboxLabel: 'मार्केटप्लेस पै लाइव करो',
      submitBtn: 'शुरू करो अर स्टॉक घटाओ',
      cancelBtn: 'रद्द',
    },
    cards: {
      processedBadge: 'प्रोसेस्ड उत्पाद',
      rawBadge: 'कच्ची फसल',
      processedFrom: 'मूल फसल',
      processingMethod: 'प्रोसेसिंग विधि',
      batchId: 'बैच नंबर',
      yield: 'रिकवरी',
      markCompleted: 'पूरा मानों',
      publishMarketplace: 'मार्केटप्लेस पै बेणो',
      viewBatchTrace: 'ट्रेसेबिलिटी देखो',
      partnerFacility: 'प्रोसेसिंग सेंटर',
    },
    aiInsight: {
      title: 'किसानसेतु AI प्रोसेसिंग सलाह',
      badge: 'AI सलाह',
      disclaimer: 'यह सलाह मंडी के मौजूदा भाव पर आधारित सै।',
    },
  },

  te: {
    moduleTitle: 'కోత అనంతర ప్రాసెసింగ్ మరియు విలువ జోడింపు',
    moduleSubtitle: 'పచ్చి పంటను తక్కువ ధరకు అమ్మకుండా ప్రాసెసింగ్ (పిండి, నూనె, పప్పు) చేసి 25-40% అధిక లాభం పొందండి.',
    tabs: {
      postHarvest: 'పోస్ట్-హార్వెస్ట్ & ప్రాసెసింగ్',
      storage: 'కోల్డ్ స్టోరేజ్ & గిడ్డంగులు',
      mills: 'భాగస్వామ్య మిల్లులు',
    },
    analytics: {
      rawProcessed: 'మొత్తం ప్రాసెస్ చేసిన ముడి పంట',
      outputProduced: 'విలువ జోడించిన ఉత్పత్తులు',
      processingLoss: 'ప్రాసెసింగ్ నష్టం',
      avgYield: 'సగటు రికవరీ',
      activeProducts: 'క్రియాశీల ఉత్పత్తులు',
      valueAddedRevenue: 'విలువ జోడింపు అమ్మకాల ఆదాయం',
      netGain: 'నికర విలువ లాభం',
    },
    filter: {
      allProduce: 'అన్ని ఉత్పత్తులు',
      rawProduce: 'ముడి పంట',
      processedProduce: 'ప్రాసెస్ చేసిన / విలువ జోడించిన',
      produceType: 'ఉత్పత్తి రకం',
    },
    stages: {
      RAW_AVAILABLE: 'ముడి స్టాక్ అందుబాటులో ఉంది',
      PROCESSING_PLANNED: 'ప్రాసెసింగ్ ప్రణాళిక',
      PROCESSING_IN_PROGRESS: 'ప్రాసెసింగ్ జరుగుతోంది',
      PROCESSED_AVAILABLE: 'అమ్మకానికి సిద్ధం',
      SOLD: 'పూర్తిగా అమ్ముడైంది',
    },
    form: {
      startProcessingBtn: '+ ప్రాసెసింగ్ ప్రారంభించండి',
      modalTitle: 'పోస్ట్-హార్వెస్ట్ ప్రాసెసింగ్ నమోదు',
      modalSubtitle: 'పంటను అధిక విలువైన ప్రాసెస్ చేసిన ఉత్పత్తులుగా మార్చండి.',
      selectCropLabel: 'పంటను ఎంచుకోండి',
      availableRawLabel: 'లభ్యమయ్యే స్టాక్',
      selectProcessingTypeLabel: 'ప్రాసెసింగ్ విధానం',
      inputQtyLabel: 'ప్రాసెసింగ్ పరిమాణం (కిలో)',
      outputQtyLabel: 'ఆశించిన అవుట్‌పుట్ (కిలో)',
      yieldLabel: 'రికవరీ (%)',
      lossLabel: 'నష్టం (కిలో)',
      processingCostLabel: 'మొత్తం ఖర్చు (₹)',
      sellingPriceLabel: 'అమ్మకపు ధర (₹/కిలో)',
      packagingLabel: 'ప్యాకేజింగ్ రకం',
      productNameLabel: 'ఉత్పత్తి పేరు',
      productGradeLabel: 'నాణ్యత గ్రేడ్',
      processingPartnerLabel: 'ప్రాసెసింగ్ కేంద్రం',
      selfProcessingOption: 'స్వంత ప్రాసెసింగ్',
      partnerMillOption: 'భాగస్వామ్య మిల్లు',
      selectPartnerMillLabel: 'మిల్లును ఎంచుకోండి',
      economicsHeading: 'లాభదాయకత విశ్లేషణ',
      rawValEstimate: 'ముడి సరుకు విలువ',
      processedGrossEstimate: 'ప్రాసెస్ చేసిన సరుకు విలువ',
      netValueGainEstimate: 'అంచనా వేసిన నికర లాభం',
      publishCheckboxLabel: 'మార్కెట్‌ప్లేస్‌లో ప్రచురించండి',
      submitBtn: 'నిర్ధారించండి',
      cancelBtn: 'రద్దు చేయండి',
    },
    cards: {
      processedBadge: 'ప్రాసెస్ చేసిన ఉత్పత్తి',
      rawBadge: 'ముడి పంట',
      processedFrom: 'మూల పంట',
      processingMethod: 'ప్రాసెసింగ్ పద్ధతి',
      batchId: 'బ్యాచ్ సంఖ్య',
      yield: 'రికవరీ',
      markCompleted: 'పూర్తయినట్లు గుర్తించండి',
      publishMarketplace: 'మార్కెట్‌లో ఉంచండి',
      viewBatchTrace: 'ట్రేస్ చేయండి',
      partnerFacility: 'ప్రాసెసింగ్ కేంద్రం',
    },
    aiInsight: {
      title: 'కిసాన్‌సేతు AI విలువ జోడింపు సలహా',
      badge: 'AI సలహా',
      disclaimer: 'ఇది మార్కెట్ విలువల ఆధారంగా ఇచ్చిన సలహా మాత్రమే.',
    },
  },

  ta: {
    moduleTitle: 'அறுவடைக்குப் பிந்தைய செயலாக்கம் & மதிப்பு கூட்டல்',
    moduleSubtitle: 'பச்சை பயிர்களை குறைந்த விலைக்கு விற்பதைத் தவிர்த்து மாவு, எண்ணெய், பருப்பாக மதிப்பு கூட்டி 25-40% கூடுதல் வருமானம் பெறுங்கள்.',
    tabs: {
      postHarvest: 'அறுவடைக்குப் பிந்தைய செயலாக்கம்',
      storage: 'குளிர்பதன கிடங்குகள்',
      mills: 'கூட்டாண்மை ஆலைகள்',
    },
    analytics: {
      rawProcessed: 'செயலாக்கப்பட்ட பயிர்',
      outputProduced: 'மதிப்பு கூட்டப்பட்ட உற்பத்தி',
      processingLoss: 'செயலாக்க இழப்பு',
      avgYield: 'சராசரி மீட்பு',
      activeProducts: 'செயலில் உள்ள தயாரிப்புகள்',
      valueAddedRevenue: 'விற்பனை வருவாய்',
      netGain: 'நிகர மதிப்பு லாபம்',
    },
    filter: {
      allProduce: 'அனைத்து தயாரிப்புகள்',
      rawProduce: 'பச்சை பயிர்',
      processedProduce: 'செயலாக்கப்பட்ட / மதிப்பு கூட்டப்பட்ட',
      produceType: 'தயாரிப்பு வகை',
    },
    stages: {
      RAW_AVAILABLE: 'கையிருப்பு உள்ளது',
      PROCESSING_PLANNED: 'செயலாக்கம் திட்டமிடப்பட்டது',
      PROCESSING_IN_PROGRESS: 'செயலாக்கம் நடக்கிறது',
      PROCESSED_AVAILABLE: 'விற்பனைக்கு தயார்',
      SOLD: 'விற்பனை முடிந்தது',
    },
    form: {
      startProcessingBtn: '+ புதிய செயலாக்கம் தொடங்குக',
      modalTitle: 'அறுவடைக்குப் பிந்தைய செயலாக்கம்',
      modalSubtitle: 'பயிர்களை உயர் மதிப்பு கொண்ட தயாரிப்புகளாக மாற்றுக.',
      selectCropLabel: 'பயிரைத் தேர்ந்தெடுக்கவும்',
      availableRawLabel: 'கிடைக்கும் இருப்பு',
      selectProcessingTypeLabel: 'செயலாக்க வகை',
      inputQtyLabel: 'செயலாக்க அளவு (கிலோ)',
      outputQtyLabel: 'எதிர்பார்க்கப்படும் அளவு (கிலோ)',
      yieldLabel: 'மீட்பு (%)',
      lossLabel: 'இழப்பு (கிலோ)',
      processingCostLabel: 'மொத்த செலவு (₹)',
      sellingPriceLabel: 'விற்பனை விலை (₹/கிலோ)',
      packagingLabel: 'பேக்கேஜிங் வகை',
      productNameLabel: 'தயாரிப்பு பெயர்',
      productGradeLabel: 'தரம்',
      processingPartnerLabel: 'செயலாக்க முறை',
      selfProcessingOption: 'சுய செயலாக்கம்',
      partnerMillOption: 'கூட்டாண்மை ஆலை',
      selectPartnerMillLabel: 'ஆலையைத் தேர்ந்தெடுக்கவும்',
      economicsHeading: 'பொருளாதார கணிப்பு',
      rawValEstimate: 'மூலப்பொருள் மதிப்பு',
      processedGrossEstimate: 'தயாரிப்பு மொத்த மதிப்பு',
      netValueGainEstimate: 'மதிப்பிடப்பட்ட கூடுதல் லாபம்',
      publishCheckboxLabel: 'சந்தையில் வெளியிடவும்',
      submitBtn: 'உறுதிசெய்க',
      cancelBtn: 'ரத்து',
    },
    cards: {
      processedBadge: 'செயலாக்கப்பட்ட தயாரிப்பு',
      rawBadge: 'பச்சை பயிர்',
      processedFrom: 'மூல பயிர்',
      processingMethod: 'செயலாக்க முறை',
      batchId: 'தொகுதி எண்',
      yield: 'மீட்பு',
      markCompleted: 'முடிந்ததாகக் குறிக்கவும்',
      publishMarketplace: 'சந்தையில் விற்க',
      viewBatchTrace: 'சுவடு காண்க',
      partnerFacility: 'செயலாக்க மையம்',
    },
    aiInsight: {
      title: 'கிசான்சேது AI மதிப்பு கூட்டல் ஆலோசனை',
      badge: 'AI ஆலோசனை',
      disclaimer: 'இது சந்தை விலை அடிப்படையிலான தகவல் வழிகாட்டல்.',
    },
  },
};

export function getProcessingTranslations(lang: LanguageCode): ProcessingTranslations {
  return processingTranslations[lang] || processingTranslations.en;
}
