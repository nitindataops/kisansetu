import { LanguageCode } from '../types';

export interface AuthModalI18n {
  farmerTitle: string;
  farmerSubtitle: string;
  buyerTitle: string;
  buyerSubtitle: string;
  loginTab: string;
  registerTab: string;

  // Fields
  identifierLabel: string;
  identifierPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  mobileLabel: string;
  mobilePlaceholder: string;

  // Farmer fields
  farmerIdLabel: string;
  farmerIdPlaceholder: string;
  districtLabel: string;
  tehsilLabel: string;
  villageLabel: string;
  landAreaLabel: string;

  // Buyer fields
  businessNameLabel: string;
  businessNamePlaceholder: string;
  professionLabel: string;
  aadhaarLabel: string;
  locationLabel: string;

  // Actions & Buttons
  loginSubmitBtn: string;
  registerSubmitBtn: string;

  // Role selector
  chooseRoleTitle: string;
  chooseRoleSubtitle: string;
  farmerCardTitle: string;
  farmerCardDesc: string;
  buyerCardTitle: string;
  buyerCardDesc: string;
  closeBtn: string;
  backToRoleSelect: string;

  // Messages
  fillAllFields: string;
  passwordMinLength: string;
  accountCreatedSuccess: string;
  loginSuccess: string;
}

export const authTranslations: Record<LanguageCode, AuthModalI18n> = {
  // 1. PRIMARY & DEFAULT: HINDI
  hi: {
    farmerTitle: 'किसान पोर्टल (विक्रेता)',
    farmerSubtitle: 'सत्यापित किसान लॉगिन एवं सुरक्षित खाता प्रबंधन',
    buyerTitle: 'खरीदार पोर्टल (व्यापारी/मिल)',
    buyerSubtitle: 'सत्यापित खरीदार लॉगिन एवं सुरक्षित खाता प्रबंधन',
    loginTab: 'लॉग इन',
    registerTab: 'नया खाता बनाएं (साइन अप)',

    identifierLabel: 'पंजीकृत मोबाइल नंबर / किसान आईडी / ईमेल',
    identifierPlaceholder: 'उदा. 9876543210 या KISAN-UP-2026',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
    fullNameLabel: 'पूरा नाम',
    fullNamePlaceholder: 'अपना नाम दर्ज करें',
    mobileLabel: 'मोबाइल नंबर',
    mobilePlaceholder: '10 अंकों का मोबाइल नंबर',

    farmerIdLabel: 'सरकारी किसान आईडी / पीएम-किसान नंबर (वैकल्पिक)',
    farmerIdPlaceholder: 'उदा. KISAN-UP-2026-8842',
    districtLabel: 'ज़िला',
    tehsilLabel: 'तहसील',
    villageLabel: 'गाँव / कस्बा',
    landAreaLabel: 'कुल कृषि भूमि (एकड़ में)',

    businessNameLabel: 'व्यापार / फर्म का नाम',
    businessNamePlaceholder: 'उदा. बरेली एग्रो ट्रेडर्स',
    professionLabel: 'खरीदार श्रेणी / प्रकार',
    aadhaarLabel: 'आधार / पैन नंबर (अंतिम 4 अंक)',
    locationLabel: 'मंडी / व्यापारिक पता',

    loginSubmitBtn: 'लॉग इन जारी रखें',
    registerSubmitBtn: 'खाता बनाएं एवं डैशबोर्ड खोलें',

    chooseRoleTitle: 'किसानसेतु में आपका स्वागत है',
    chooseRoleSubtitle: 'कृपया जारी रखने के लिए अपनी भूमिका चुनें',
    farmerCardTitle: 'मैं किसान / उत्पादक हूँ',
    farmerCardDesc: 'सीधे सत्यापित खरीदारों से जुड़ें, उचित मंडी भाव पाएं और फसल बेचें।',
    buyerCardTitle: 'मैं खरीदार / व्यापारी हूँ',
    buyerCardDesc: 'सीधे खेतों से उच्च गुणवत्ता वाली फसलें खरीदें और पारदर्शी व्यापार करें।',
    closeBtn: 'बंद करें',
    backToRoleSelect: '← भूमिका बदलें',

    fillAllFields: 'कृपया सभी आवश्यक फ़ील्ड भरें।',
    passwordMinLength: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
    accountCreatedSuccess: 'खाता सफलतापूर्वक बन गया! आपका स्वागत है।',
    loginSuccess: 'लॉग इन सफल!',
  },

  // 2. ENGLISH
  en: {
    farmerTitle: 'Farmer Portal (Seller)',
    farmerSubtitle: 'Verified farmer login and secure account access',
    buyerTitle: 'Buyer Portal (Trader/Mill)',
    buyerSubtitle: 'Verified buyer login and secure account access',
    loginTab: 'Login',
    registerTab: 'Register (Sign Up)',

    identifierLabel: 'Registered Mobile / Farmer ID / Email',
    identifierPlaceholder: 'e.g. 9876543210 or KISAN-UP-2026',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Enter your password',
    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Enter your full name',
    mobileLabel: 'Mobile Number',
    mobilePlaceholder: '10-digit Indian Mobile Number',

    farmerIdLabel: 'Govt Farmer ID / PM-Kisan ID (Optional)',
    farmerIdPlaceholder: 'e.g. KISAN-UP-2026-8842',
    districtLabel: 'District',
    tehsilLabel: 'Tehsil / Sub-district',
    villageLabel: 'Village / Town',
    landAreaLabel: 'Total Land Area (in Acres)',

    businessNameLabel: 'Business / Enterprise Name',
    businessNamePlaceholder: 'e.g. Bareilly Agro Traders',
    professionLabel: 'Buyer Category / Profession',
    aadhaarLabel: 'Aadhaar / PAN (Last 4 Digits)',
    locationLabel: 'Mandi / Business Location',

    loginSubmitBtn: 'Continue Login',
    registerSubmitBtn: 'Create Account & Open Dashboard',

    chooseRoleTitle: 'Welcome to KisanSetu',
    chooseRoleSubtitle: 'Please select your role to continue',
    farmerCardTitle: 'I am a Farmer / Producer',
    farmerCardDesc: 'Connect directly with verified buyers, get fair APMC rates, and sell your produce.',
    buyerCardTitle: 'I am a Buyer / Trader / Mill',
    buyerCardDesc: 'Procure farm-fresh crops directly from verified growers with full transparency.',
    closeBtn: 'Close',
    backToRoleSelect: '← Change Role',

    fillAllFields: 'Please fill in all required fields.',
    passwordMinLength: 'Password must be at least 6 characters long.',
    accountCreatedSuccess: 'Account created successfully! Welcome to KisanSetu.',
    loginSuccess: 'Login successful!',
  },

  // 3. PUNJABI
  pa: {
    farmerTitle: 'ਕਿਸਾਨ ਪੋਰਟਲ (ਵਿਕਰੇਤਾ)',
    farmerSubtitle: 'ਪ੍ਰਮਾਣਿਤ ਕਿਸਾਨ ਲੌਗਇਨ ਅਤੇ ਖਾਤਾ ਪ੍ਰਬੰਧਨ',
    buyerTitle: 'ਖਰੀਦਦਾਰ ਪੋਰਟਲ (ਵਪਾਰੀ/ਮਿੱਲ)',
    buyerSubtitle: 'ਪ੍ਰਮਾਣਿਤ ਖਰੀਦਦਾਰ ਲੌਗਇਨ ਅਤੇ ਖਾਤਾ ਪ੍ਰਬੰਧਨ',
    loginTab: 'ਲੌਗ ਇਨ',
    registerTab: 'ਨਵਾਂ ਖਾਤਾ ਬਣਾਓ',

    identifierLabel: 'ਰਜਿਸਟਰਡ ਮੋਬਾਈਲ / ਕਿਸਾਨ ਆਈਡੀ / ਈਮੇਲ',
    identifierPlaceholder: 'ਉਦਾ. 9876543210',
    passwordLabel: 'ਪਾਸਵਰਡ',
    passwordPlaceholder: 'ਆਪਣਾ ਪਾਸਵਰਡ ਦਰਜ ਕਰੋ',
    fullNameLabel: 'ਪੂਰਾ ਨਾਮ',
    fullNamePlaceholder: 'ਆਪਣਾ ਨਾਮ ਦਰਜ ਕਰੋ',
    mobileLabel: 'ਮੋਬਾਈਲ ਨੰਬਰ',
    mobilePlaceholder: '10 ਅੰਕਾਂ ਦਾ ਮੋਬਾਈਲ ਨੰਬਰ',

    farmerIdLabel: 'ਸਰਕਾਰੀ ਕਿਸਾਨ ਆਈਡੀ (ਵਿਕਲਪਿਕ)',
    farmerIdPlaceholder: 'ਉਦਾ. KISAN-PB-2026',
    districtLabel: 'ਜ਼ਿਲ੍ਹਾ',
    tehsilLabel: 'ਤਹਿਸੀਲ',
    villageLabel: 'ਪਿੰਡ / ਸ਼ਹਿਰ',
    landAreaLabel: 'ਕੁੱਲ ਜ਼ਮੀਨ (ਏਕੜ ਵਿੱਚ)',

    businessNameLabel: 'ਫਰਮ / ਕਾਰੋਬਾਰ ਦਾ ਨਾਮ',
    businessNamePlaceholder: 'ਉਦਾ. ਪੰਜਾਬ ਐਗਰੋ ਟਰੇਡਰਜ਼',
    professionLabel: 'ਖਰੀਦਦਾਰ ਸ਼੍ਰੇਣੀ',
    aadhaarLabel: 'ਆਧਾਰ / ਪੈਨ ਨੰਬਰ',
    locationLabel: 'ਮੰਡੀ ਦਾ ਪਤਾ',

    loginSubmitBtn: 'ਲੌਗਇਨ ਜਾਰੀ ਰੱਖੋ',
    registerSubmitBtn: 'ਖਾਤਾ ਬਣਾਓ',

    chooseRoleTitle: 'ਕਿਸਾਨਸੇਤੂ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ',
    chooseRoleSubtitle: 'ਕਿਰਪਾ ਕਰਕੇ ਜਾਰੀ ਰੱਖਣ ਲਈ ਆਪਣੀ ਭੂਮਿਕਾ ਚੁਣੋ',
    farmerCardTitle: 'ਮੈਂ ਕਿਸਾਨ ਹਾਂ',
    farmerCardDesc: 'ਸਿੱਧੇ ਖਰੀਦਦਾਰਾਂ ਨਾਲ ਜੁੜੋ ਅਤੇ ਸਹੀ ਮੰਡੀ ਭਾਅ ਪ੍ਰਾਪਤ ਕਰੋ।',
    buyerCardTitle: 'ਮੈਂ ਖਰੀਦਦਾਰ / ਵਪਾਰੀ ਹਾਂ',
    buyerCardDesc: 'ਕਿਸਾਨਾਂ ਤੋਂ ਸਿੱਧੀਆਂ ਤਾਜ਼ੀਆਂ ਫ਼ਸਲਾਂ ਖਰੀਦੋ।',
    closeBtn: 'ਬੰਦ ਕਰੋ',
    backToRoleSelect: '← ਭੂਮਿਕਾ ਬਦਲੋ',

    fillAllFields: 'ਕਿਰਪਾ ਕਰਕੇ ਸਾਰੇ ਖੇਤਰ ਭਰੋ।',
    passwordMinLength: 'ਪਾਸਵਰਡ ਘੱਟੋ-ਘੱਟ 6 ਅੱਖਰਾਂ ਦਾ ਹੋਣਾ ਚਾਹੀਦਾ ਹੈ।',
    accountCreatedSuccess: 'ਖਾਤਾ ਸਫਲਤਾਪੂਰਵਕ ਬਣ ਗਿਆ!',
    loginSuccess: 'ਲੌਗਇਨ ਸਫਲ!',
  },

  // 4. HARYANVI
  hr: {
    farmerTitle: 'किसान पोर्टल (बेचन आळा)',
    farmerSubtitle: 'सत्यापित किसान लॉगिन अर खाता प्रबंधन',
    buyerTitle: 'खरीदार पोर्टल (व्यापारी/मिल)',
    buyerSubtitle: 'सत्यापित खरीदार लॉगिन अर खाता प्रबंधन',
    loginTab: 'लॉग इन',
    registerTab: 'नया खाता बणाओ',

    identifierLabel: 'पंजीकृत मोबाइल नंबर / किसान आईडी',
    identifierPlaceholder: 'उदा. 9876543210',
    passwordLabel: 'पासवर्ड',
    passwordPlaceholder: 'अपणा पासवर्ड भरो',
    fullNameLabel: 'पूरा नाम',
    fullNamePlaceholder: 'अपणा नाम लिखो',
    mobileLabel: 'मोबाइल नंबर',
    mobilePlaceholder: '10 अंका का मोबाइल नंबर',

    farmerIdLabel: 'सरकारी किसान आईडी (मर्जी है)',
    farmerIdPlaceholder: 'उदा. KISAN-HR-2026',
    districtLabel: 'जिला',
    tehsilLabel: 'तहसील',
    villageLabel: 'गाम / कस्बा',
    landAreaLabel: 'कुल खेती जमीन (एकड़ में)',

    businessNameLabel: 'फर्म / दुकान का नाम',
    businessNamePlaceholder: 'उदा. हरियाणा एग्रो ट्रेडर्स',
    professionLabel: 'खरीदार की श्रेणी',
    aadhaarLabel: 'आधार नंबर (आखिरी 4 अंक)',
    locationLabel: 'मंडी का पता',

    loginSubmitBtn: 'लॉग इन करो',
    registerSubmitBtn: 'खाता बणाओ अर डैशबोर्ड खोलो',

    chooseRoleTitle: 'किसानसेतु में थारा स्वागत सै',
    chooseRoleSubtitle: 'अपणी भूमिका चुणो',
    farmerCardTitle: 'मैं किसान सूं',
    farmerCardDesc: 'सीधा व्यापारी से जुड़ो अर सही मंडी भाव पाओ।',
    buyerCardTitle: 'मैं खरीदार / व्यापारी सूं',
    buyerCardDesc: 'सीधा खेत ते फसल खरीदो।',
    closeBtn: 'बंद करो',
    backToRoleSelect: '← पाछे मुड़ो',

    fillAllFields: 'सारे जरूरी खाने भरो।',
    passwordMinLength: 'पासवर्ड कम से कम 6 अक्षरां का होणा जरूरी सै।',
    accountCreatedSuccess: 'खाता बण ग्या! स्वागत सै।',
    loginSuccess: 'लॉग इन हो ग्या!',
  },

  // 5. TELUGU
  te: {
    farmerTitle: 'రైతు పోర్టల్ (విక్రేత)',
    farmerSubtitle: 'ధృవీకరించబడిన రైతు లాగిన్ మరియు ఖాతా నిర్వహణ',
    buyerTitle: 'కొనుగోలుదారు పోర్టల్ (వ్యాపారి/మిల్లు)',
    buyerSubtitle: 'ధృవీకరించబడిన కొనుగోలుదారు లాగిన్ మరియు ఖాతా నిర్వహణ',
    loginTab: 'లాగిన్',
    registerTab: 'నమోదు చేసుకోండి',

    identifierLabel: 'నమోదిత మొబైల్ / రైతు ID / ఇమెయిల్',
    identifierPlaceholder: 'ఉదా. 9876543210',
    passwordLabel: 'పాస్‌వర్డ్',
    passwordPlaceholder: 'మీ పాస్‌వర్డ్ నమోదు చేయండి',
    fullNameLabel: 'పూర్తి పేరు',
    fullNamePlaceholder: 'మీ పేరు నమోదు చేయండి',
    mobileLabel: 'మొబైల్ నంబర్',
    mobilePlaceholder: '10 అంకెల మొబైల్ నంబర్',

    farmerIdLabel: 'ప్రభుత్వ రైతు ID (ఐచ్ఛికం)',
    farmerIdPlaceholder: 'ఉదా. KISAN-AP-2026',
    districtLabel: 'జిల్లా',
    tehsilLabel: 'మండలం',
    villageLabel: 'గ్రామం / పట్టణం',
    landAreaLabel: 'మొత్తం భూమి (ఎకరాలలో)',

    businessNameLabel: 'వ్యాపార పేరు',
    businessNamePlaceholder: 'ఉదా. శ్రీ బాలాజీ ట్రేడర్స్',
    professionLabel: 'కొనుగోలుదారు వర్గం',
    aadhaarLabel: 'ఆధార్ / పాన్ నంబర్',
    locationLabel: 'మార్కెట్ యార్డ్ చిరునామా',

    loginSubmitBtn: 'లాగిన్ కొనసాగించండి',
    registerSubmitBtn: 'ఖాతాను సృష్టించండి',

    chooseRoleTitle: 'కిసాన్‌సేతుకు స్వాగతం',
    chooseRoleSubtitle: 'కొనసాగించడానికి మీ పాత్రను ఎంచుకోండి',
    farmerCardTitle: 'నేను రైతును',
    farmerCardDesc: 'కొనుగోలుదారులతో నేరుగా కనెక్ట్ అవ్వండి మరియు సరైన ధరను పొందండి.',
    buyerCardTitle: 'నేను కొనుగోలుదారుని',
    buyerCardDesc: 'రైతుల నుండి నేరుగా నాణ్యమైన పంటలను కొనుగోలు చేయండి.',
    closeBtn: 'మూసివేయి',
    backToRoleSelect: '← పాత్రను మార్చండి',

    fillAllFields: 'దయచేసి అన్ని అవసరమైన వివరాలను పూరించండి.',
    passwordMinLength: 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు ఉండాలి.',
    accountCreatedSuccess: 'ఖాతా విజయవంతంగా సృష్టించబడింది!',
    loginSuccess: 'లాగిన్ విజయవంతమైంది!',
  },

  // 6. TAMIL
  ta: {
    farmerTitle: 'விவசாயி போர்டல் (விற்பனையாளர்)',
    farmerSubtitle: 'சரிபார்க்கப்பட்ட விவசாயி உள்நுழைவு & கணக்கு மேலாண்மை',
    buyerTitle: 'வாங்குபவர் போர்டல் (வணிகர்/ஆலை)',
    buyerSubtitle: 'சரிபார்க்கப்பட்ட வாங்குபவர் உள்நுழைவு & கணக்கு மேலாண்மை',
    loginTab: 'உள்நுழைக',
    registerTab: 'பதிவு செய்க',

    identifierLabel: 'பதிவுசெய்த மொபைல் / விவசாயி ID / மின்னஞ்சல்',
    identifierPlaceholder: 'எ.கா. 9876543210',
    passwordLabel: 'கடவுச்சொல்',
    passwordPlaceholder: 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்',
    fullNameLabel: 'முழு பெயர்',
    fullNamePlaceholder: 'உங்கள் பெயரை உள்ளிடவும்',
    mobileLabel: 'மொபைல் எண்',
    mobilePlaceholder: '10 இலக்க மொபைல் எண்',

    farmerIdLabel: 'அரசு விவசாயி ID (விருப்பத்திற்குரியது)',
    farmerIdPlaceholder: 'எ.கா. KISAN-TN-2026',
    districtLabel: 'மாவட்டம்',
    tehsilLabel: 'வட்டம் (தாலுகா)',
    villageLabel: 'கிராமம் / நகரம்',
    landAreaLabel: 'மொத்த நிலப்பரப்பு (ஏக்கரில்)',

    businessNameLabel: 'நிறுவனத்தின் பெயர்',
    businessNamePlaceholder: 'எ.கா. தமிழ்நாடு அக்ரோ டிரேடர்ஸ்',
    professionLabel: 'வாங்குபவர் பிரிவு',
    aadhaarLabel: 'ஆதார் / பான் எண்',
    locationLabel: 'மண்டி முகவரி',

    loginSubmitBtn: 'உள்நுழைக',
    registerSubmitBtn: 'கணக்கை உருவாக்கி தொடர்க',

    chooseRoleTitle: 'கிசான்சேதுவிற்கு வரவேற்கிறோம்',
    chooseRoleSubtitle: 'தொடர உங்கள் பங்கைத் தேர்ந்தெடுக்கவும்',
    farmerCardTitle: 'நான் ஒரு விவசாயி',
    farmerCardDesc: 'நேரடியாக வாங்குபவர்களுடன் இணைந்து நியாயமான விலை பெறுங்கள்.',
    buyerCardTitle: 'நான் ஒரு வாங்குபவர் / வணிகர்',
    buyerCardDesc: 'விவசாயிகளிடமிருந்து நேரடியாக பயிர்களை வாங்குங்கள்.',
    closeBtn: 'மூடு',
    backToRoleSelect: '← பங்கை மாற்றவும்',

    fillAllFields: 'அனைத்து தேவையான புலங்களையும் நிரப்பவும்.',
    passwordMinLength: 'கடவுச்சொல் குறைந்தபட்சம் 6 எழுத்துகள் இருக்க வேண்டும்.',
    accountCreatedSuccess: 'கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது!',
    loginSuccess: 'உள்நுழைவு வெற்றிகரமாக முடிந்தது!',
  },
};
