// Translation dictionary for the site's UI chrome (nav, header, footer,
// cart, checkout, orders, auth, notifications, common buttons/messages).
// Deliberately does NOT cover the ~800 real product names/descriptions in
// the catalogue - those are actual business content pulled from
// Firestore/data/products.js, and machine-generating translations for real
// products across 5 languages would be inaccurate and worse than leaving
// them as-is. The admin panel exposes per-language fields (Products/
// Categories pages) so real, reviewed translations can be entered over
// time instead.
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'ml', label: 'മലയാളം' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
];

const nav = {
  en: { plants: 'Plants', seeds: 'Seeds', potsPlanters: 'Pots & Planters', plantCare: 'Plant Care', landscaping: 'Landscaping', gifting: 'Gifting', b2bSales: 'B2B Sales', gardenServices: 'Garden Services', blog: 'Blog', offers: 'Offers', locateStore: 'Locate Store' },
  ta: { plants: 'செடிகள்', seeds: 'விதைகள்', potsPlanters: 'தொட்டிகள் மற்றும் பாட்ஸ்', plantCare: 'செடி பராமரிப்பு', landscaping: 'லேண்ட்ஸ்கேப்பிங்', gifting: 'பரிசுகள்', b2bSales: 'B2B விற்பனை', gardenServices: 'தோட்ட சேவைகள்', blog: 'வலைப்பதிவு', offers: 'சலுகைகள்', locateStore: 'கடை கண்டறிக' },
  hi: { plants: 'पौधे', seeds: 'बीज', potsPlanters: 'गमले और प्लांटर', plantCare: 'पौधों की देखभाल', landscaping: 'लैंडस्केपिंग', gifting: 'उपहार', b2bSales: 'B2B बिक्री', gardenServices: 'बागवानी सेवाएं', blog: 'ब्लॉग', offers: 'ऑफ़र', locateStore: 'स्टोर खोजें' },
  ml: { plants: 'ചെടികൾ', seeds: 'വിത്തുകൾ', potsPlanters: 'ചട്ടികളും പ്ലാന്ററുകളും', plantCare: 'ചെടി പരിചരണം', landscaping: 'ലാൻഡ്സ്കേപ്പിംഗ്', gifting: 'സമ്മാനങ്ങൾ', b2bSales: 'B2B വിൽപ്പന', gardenServices: 'തോട്ട സേവനങ്ങൾ', blog: 'ബ്ലോഗ്', offers: 'ഓഫറുകൾ', locateStore: 'സ്റ്റോർ കണ്ടെത്തുക' },
  te: { plants: 'మొక్కలు', seeds: 'విత్తనాలు', potsPlanters: 'కుండలు & ప్లాంటర్లు', plantCare: 'మొక్కల సంరక్షణ', landscaping: 'ల్యాండ్‌స్కేపింగ్', gifting: 'బహుమతులు', b2bSales: 'B2B అమ్మకాలు', gardenServices: 'తోట సేవలు', blog: 'బ్లాగ్', offers: 'ఆఫర్లు', locateStore: 'స్టోర్ కనుగొనండి' },
  kn: { plants: 'ಸಸ್ಯಗಳು', seeds: 'ಬೀಜಗಳು', potsPlanters: 'ಪಾಟ್‌ಗಳು ಮತ್ತು ಪ್ಲಾಂಟರ್‌ಗಳು', plantCare: 'ಸಸ್ಯ ಆರೈಕೆ', landscaping: 'ಲ್ಯಾಂಡ್‌ಸ್ಕೇಪಿಂಗ್', gifting: 'ಉಡುಗೊರೆಗಳು', b2bSales: 'B2B ಮಾರಾಟ', gardenServices: 'ತೋಟ ಸೇವೆಗಳು', blog: 'ಬ್ಲಾಗ್', offers: 'ಆಫರ್‌ಗಳು', locateStore: 'ಅಂಗಡಿ ಹುಡುಕಿ' },
};

const search = {
  en: { placeholders: ['Search plants...', 'Search seeds...', 'Search pots & planters...', 'Search plant care...', 'Search gifting...'], ariaLabel: 'Search plants, pots, seeds', micSearch: 'Search by voice', micListening: 'Listening... click to stop', micDenied: 'Microphone access denied.', micError: "Couldn't hear that - try again." },
  ta: { placeholders: ['செடிகளை தேடுங்கள்...', 'விதைகளை தேடுங்கள்...', 'தொட்டிகளை தேடுங்கள்...', 'செடி பராமரிப்பு தேடுங்கள்...', 'பரிசுகளை தேடுங்கள்...'], ariaLabel: 'செடிகள், தொட்டிகள், விதைகளை தேடுங்கள்', micSearch: 'குரல் மூலம் தேடுக', micListening: 'கேட்கிறது... நிறுத்த கிளிக் செய்யவும்', micDenied: 'மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது.', micError: 'கேட்க முடியவில்லை - மீண்டும் முயற்சிக்கவும்.' },
  hi: { placeholders: ['पौधे खोजें...', 'बीज खोजें...', 'गमले खोजें...', 'पौध देखभाल खोजें...', 'उपहार खोजें...'], ariaLabel: 'पौधे, गमले, बीज खोजें', micSearch: 'आवाज़ से खोजें', micListening: 'सुन रहा है... रोकने के लिए क्लिक करें', micDenied: 'माइक्रोफ़ोन एक्सेस अस्वीकृत।', micError: 'सुन नहीं पाया - फिर से प्रयास करें।' },
  ml: { placeholders: ['ചെടികൾ തിരയുക...', 'വിത്തുകൾ തിരയുക...', 'ചട്ടികൾ തിരയുക...', 'ചെടി പരിചരണം തിരയുക...', 'സമ്മാനങ്ങൾ തിരയുക...'], ariaLabel: 'ചെടികൾ, ചട്ടികൾ, വിത്തുകൾ തിരയുക', micSearch: 'ശബ്ദത്തിലൂടെ തിരയുക', micListening: 'കേൾക്കുന്നു... നിർത്താൻ ക്ലിക്ക് ചെയ്യുക', micDenied: 'മൈക്രോഫോൺ ആക്സസ് നിരസിച്ചു.', micError: 'കേൾക്കാൻ കഴിഞ്ഞില്ല - വീണ്ടും ശ്രമിക്കുക.' },
  te: { placeholders: ['మొక్కలను వెతకండి...', 'విత్తనాలను వెతకండి...', 'కుండలను వెతకండి...', 'మొక్కల సంరక్షణ వెతకండి...', 'బహుమతులను వెతకండి...'], ariaLabel: 'మొక్కలు, కుండలు, విత్తనాలు వెతకండి', micSearch: 'వాయిస్ ద్వారా వెతకండి', micListening: 'వింటోంది... ఆపడానికి క్లిక్ చేయండి', micDenied: 'మైక్రోఫోన్ యాక్సెస్ నిరాకరించబడింది.', micError: 'వినడం సాధ్యం కాలేదు - మళ్ళీ ప్రయత్నించండి.' },
  kn: { placeholders: ['ಸಸ್ಯಗಳನ್ನು ಹುಡುಕಿ...', 'ಬೀಜಗಳನ್ನು ಹುಡುಕಿ...', 'ಪಾಟ್‌ಗಳನ್ನು ಹುಡುಕಿ...', 'ಸಸ್ಯ ಆರೈಕೆ ಹುಡುಕಿ...', 'ಉಡುಗೊರೆಗಳನ್ನು ಹುಡುಕಿ...'], ariaLabel: 'ಸಸ್ಯಗಳು, ಪಾಟ್‌ಗಳು, ಬೀಜಗಳನ್ನು ಹುಡುಕಿ', micSearch: 'ಧ್ವನಿಯ ಮೂಲಕ ಹುಡುಕಿ', micListening: 'ಕೇಳುತ್ತಿದೆ... ನಿಲ್ಲಿಸಲು ಕ್ಲಿಕ್ ಮಾಡಿ', micDenied: 'ಮೈಕ್ರೊಫೋನ್ ಪ್ರವೇಶ ನಿರಾಕರಿಸಲಾಗಿದೆ.', micError: 'ಕೇಳಲು ಸಾಧ್ಯವಾಗಲಿಲ್ಲ - ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.' },
};

const header = {
  en: { account: 'Account', wishlist: 'Wishlist', cart: 'Cart', notifications: 'Notifications', language: 'Language' },
  ta: { account: 'கணக்கு', wishlist: 'விருப்பப்பட்டியல்', cart: 'கார்ட்', notifications: 'அறிவிப்புகள்', language: 'மொழி' },
  hi: { account: 'खाता', wishlist: 'विशलिस्ट', cart: 'कार्ट', notifications: 'सूचनाएं', language: 'भाषा' },
  ml: { account: 'അക്കൗണ്ട്', wishlist: 'വിഷ്‌ലിസ്റ്റ്', cart: 'കാർട്ട്', notifications: 'അറിയിപ്പുകൾ', language: 'ഭാഷ' },
  te: { account: 'ఖాతా', wishlist: 'విష్‌లిస్ట్', cart: 'కార్ట్', notifications: 'నోటిఫికేషన్‌లు', language: 'భాష' },
  kn: { account: 'ಖಾತೆ', wishlist: 'ವಿಶ್‌ಲಿಸ್ಟ್', cart: 'ಕಾರ್ಟ್', notifications: 'ಅಧಿಸೂಚನೆಗಳು', language: 'ಭಾಷೆ' },
};

const notifications = {
  en: { title: 'Notifications', empty: 'No notifications yet - order updates will show up here.', markAllRead: 'Mark all as read' },
  ta: { title: 'அறிவிப்புகள்', empty: 'இதுவரை அறிவிப்புகள் இல்லை - ஆர்டர் புதுப்பிப்புகள் இங்கே காண்பிக்கப்படும்.', markAllRead: 'அனைத்தையும் படித்ததாக குறிக்கவும்' },
  hi: { title: 'सूचनाएं', empty: 'अभी तक कोई सूचना नहीं - ऑर्डर अपडेट यहां दिखेंगे।', markAllRead: 'सभी को पढ़ा हुआ चिह्नित करें' },
  ml: { title: 'അറിയിപ്പുകൾ', empty: 'ഇതുവരെ അറിയിപ്പുകൾ ഇല്ല - ഓർഡർ അപ്‌ഡേറ്റുകൾ ഇവിടെ കാണിക്കും.', markAllRead: 'എല്ലാം വായിച്ചതായി അടയാളപ്പെടുത്തുക' },
  te: { title: 'నోటిఫికేషన్‌లు', empty: 'ఇంకా నోటిఫికేషన్‌లు లేవు - ఆర్డర్ అప్‌డేట్‌లు ఇక్కడ కనిపిస్తాయి.', markAllRead: 'అన్నింటినీ చదివినట్లు గుర్తించండి' },
  kn: { title: 'ಅಧಿಸೂಚನೆಗಳು', empty: 'ಇನ್ನೂ ಅಧಿಸೂಚನೆಗಳಿಲ್ಲ - ಆರ್ಡರ್ ಅಪ್‌ಡೇಟ್‌ಗಳು ಇಲ್ಲಿ ಕಾಣಿಸುತ್ತವೆ.', markAllRead: 'ಎಲ್ಲವನ್ನೂ ಓದಿದಂತೆ ಗುರುತಿಸಿ' },
};

const footer = {
  en: { tagline: 'GROW BETTER • LIVE GREENER', description: 'A modern AgriTech nursery bringing plants, seeds, planters and gardening essentials together in one place.', shop: 'Shop', discover: 'Discover', account: 'Account', rights: 'All rights reserved.', builtFor: 'Built for a greener everyday.' },
  ta: { tagline: 'சிறப்பாக வளருங்கள் • பசுமையாக வாழுங்கள்', description: 'செடிகள், விதைகள், தொட்டிகள் மற்றும் தோட்ட தேவைகள் அனைத்தையும் ஒரே இடத்தில் வழங்கும் நவீன அக்ரிடெக் நர்சரி.', shop: 'கடை', discover: 'கண்டறியுங்கள்', account: 'கணக்கு', rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.', builtFor: 'பசுமையான நாளைக்காக உருவாக்கப்பட்டது.' },
  hi: { tagline: 'बेहतर उगाएं • हरा जिएं', description: 'पौधे, बीज, गमले और बागवानी की हर ज़रूरत एक ही जगह लाने वाली एक आधुनिक एग्रीटेक नर्सरी।', shop: 'दुकान', discover: 'खोजें', account: 'खाता', rights: 'सर्वाधिकार सुरक्षित।', builtFor: 'एक हरे-भरे कल के लिए बनाया गया।' },
  ml: { tagline: 'നന്നായി വളരൂ • പച്ചയായി ജീവിക്കൂ', description: 'ചെടികൾ, വിത്തുകൾ, ചട്ടികൾ, തോട്ട ആവശ്യങ്ങൾ എല്ലാം ഒരിടത്ത് എത്തിക്കുന്ന ആധുനിക അഗ്രിടെക് നഴ്സറി.', shop: 'ഷോപ്പ്', discover: 'കണ്ടെത്തുക', account: 'അക്കൗണ്ട്', rights: 'എല്ലാ അവകാശങ്ങളും നിക്ഷിപ്തം.', builtFor: 'പച്ചപ്പുള്ള നാളെക്കായി നിർമ്മിച്ചത്.' },
  te: { tagline: 'బాగా పెంచండి • పచ్చగా జీవించండి', description: 'మొక్కలు, విత్తనాలు, కుండలు మరియు తోట అవసరాలను ఒకే చోట తీసుకువచ్చే ఆధునిక అగ్రిటెక్ నర్సరీ.', shop: 'షాప్', discover: 'కనుగొనండి', account: 'ఖాతా', rights: 'అన్ని హక్కులు రక్షించబడ్డాయి.', builtFor: 'పచ్చని రేపటి కోసం నిర్మించబడింది.' },
  kn: { tagline: 'ಚೆನ್ನಾಗಿ ಬೆಳೆಸಿ • ಹಸಿರಾಗಿ ಬದುಕಿ', description: 'ಸಸ್ಯಗಳು, ಬೀಜಗಳು, ಪಾಟ್‌ಗಳು ಮತ್ತು ತೋಟದ ಅಗತ್ಯಗಳನ್ನು ಒಂದೇ ಸ್ಥಳದಲ್ಲಿ ತರುವ ಆಧುನಿಕ ಅಗ್ರಿಟೆಕ್ ನರ್ಸರಿ.', shop: 'ಅಂಗಡಿ', discover: 'ಅನ್ವೇಷಿಸಿ', account: 'ಖಾತೆ', rights: 'ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ.', builtFor: 'ಹಸಿರಾದ ನಾಳೆಗಾಗಿ ನಿರ್ಮಿಸಲಾಗಿದೆ.' },
};

const cart = {
  en: { title: 'Shopping cart', empty: 'Your cart is waiting for something green.', continueShopping: 'Continue shopping', orderSummary: 'Order summary', subtotal: 'Subtotal', delivery: 'Delivery', calculatedAtCheckout: 'Calculated at checkout', proceedToCheckout: 'Proceed to checkout', remove: 'Remove', quantity: 'Quantity', discount: 'Discount', total: 'Total', applyCoupon: 'Apply coupon' },
  ta: { title: 'கார்ட்', empty: 'உங்கள் கார்ட் ஏதோ பசுமையானதற்காக காத்திருக்கிறது.', continueShopping: 'தொடர்ந்து ஷாப்பிங் செய்யுங்கள்', orderSummary: 'ஆர்டர் சுருக்கம்', subtotal: 'மொத்தம்', delivery: 'டெலிவரி', calculatedAtCheckout: 'செக்அவுட்டில் கணக்கிடப்படும்', proceedToCheckout: 'செக்அவுட் செய்யவும்', remove: 'நீக்கு', quantity: 'எண்ணிக்கை', discount: 'தள்ளுபடி', total: 'மொத்த தொகை', applyCoupon: 'கூப்பன் பயன்படுத்து' },
  hi: { title: 'शॉपिंग कार्ट', empty: 'आपका कार्ट किसी हरे-भरे चीज़ का इंतज़ार कर रहा है।', continueShopping: 'खरीदारी जारी रखें', orderSummary: 'ऑर्डर सारांश', subtotal: 'उप-योग', delivery: 'डिलीवरी', calculatedAtCheckout: 'चेकआउट पर गणना की जाएगी', proceedToCheckout: 'चेकआउट पर जाएं', remove: 'हटाएं', quantity: 'मात्रा', discount: 'छूट', total: 'कुल', applyCoupon: 'कूपन लगाएं' },
  ml: { title: 'ഷോപ്പിംഗ് കാർട്ട്', empty: 'നിങ്ങളുടെ കാർട്ട് പച്ചയായ എന്തിനോ കാത്തിരിക്കുന്നു.', continueShopping: 'ഷോപ്പിംഗ് തുടരുക', orderSummary: 'ഓർഡർ സംഗ്രഹം', subtotal: 'ഉപആകെത്തുക', delivery: 'ഡെലിവറി', calculatedAtCheckout: 'ചെക്ക്ഔട്ടിൽ കണക്കാക്കും', proceedToCheckout: 'ചെക്ക്ഔട്ട് ചെയ്യുക', remove: 'നീക്കം ചെയ്യുക', quantity: 'അളവ്', discount: 'കിഴിവ്', total: 'ആകെ', applyCoupon: 'കൂപ്പൺ പ്രയോഗിക്കുക' },
  te: { title: 'షాపింగ్ కార్ట్', empty: 'మీ కార్ట్ పచ్చని దాని కోసం ఎదురుచూస్తోంది.', continueShopping: 'షాపింగ్ కొనసాగించండి', orderSummary: 'ఆర్డర్ సారాంశం', subtotal: 'ఉప మొత్తం', delivery: 'డెలివరీ', calculatedAtCheckout: 'చెక్అవుట్‌లో లెక్కించబడుతుంది', proceedToCheckout: 'చెక్అవుట్‌కు వెళ్లండి', remove: 'తొలగించు', quantity: 'పరిమాణం', discount: 'తగ్గింపు', total: 'మొత్తం', applyCoupon: 'కూపన్ వర్తింపజేయండి' },
  kn: { title: 'ಶಾಪಿಂಗ್ ಕಾರ್ಟ್', empty: 'ನಿಮ್ಮ ಕಾರ್ಟ್ ಹಸಿರಾದ ಏನೋ ಒಂದಕ್ಕಾಗಿ ಕಾಯುತ್ತಿದೆ.', continueShopping: 'ಶಾಪಿಂಗ್ ಮುಂದುವರಿಸಿ', orderSummary: 'ಆರ್ಡರ್ ಸಾರಾಂಶ', subtotal: 'ಉಪ ಮೊತ್ತ', delivery: 'ಡೆಲಿವರಿ', calculatedAtCheckout: 'ಚೆಕ್‌ಔಟ್‌ನಲ್ಲಿ ಲೆಕ್ಕಹಾಕಲಾಗುತ್ತದೆ', proceedToCheckout: 'ಚೆಕ್‌ಔಟ್‌ಗೆ ಮುಂದುವರಿಯಿರಿ', remove: 'ತೆಗೆದುಹಾಕಿ', quantity: 'ಪ್ರಮಾಣ', discount: 'ರಿಯಾಯಿತಿ', total: 'ಒಟ್ಟು', applyCoupon: 'ಕೂಪನ್ ಅನ್ವಯಿಸಿ' },
};

const auth = {
  en: { signIn: 'Sign in', createAccount: 'Create account', email: 'Email', password: 'Password', name: 'Name', logIn: 'Log in', logOut: 'Log out', phone: 'Phone number', emailRequired: 'Please enter your email address.', passwordRequired: 'Please enter your password.', invalidCredentials: 'Incorrect email or password.' },
  ta: { signIn: 'உள்நுழையவும்', createAccount: 'கணக்கை உருவாக்கவும்', email: 'மின்னஞ்சல்', password: 'கடவுச்சொல்', name: 'பெயர்', logIn: 'உள்நுழையவும்', logOut: 'வெளியேறு', phone: 'தொலைபேசி எண்', emailRequired: 'உங்கள் மின்னஞ்சல் முகவரியை உள்ளிடவும்.', passwordRequired: 'உங்கள் கடவுச்சொல்லை உள்ளிடவும்.', invalidCredentials: 'தவறான மின்னஞ்சல் அல்லது கடவுச்சொல்.' },
  hi: { signIn: 'साइन इन करें', createAccount: 'खाता बनाएं', email: 'ईमेल', password: 'पासवर्ड', name: 'नाम', logIn: 'लॉग इन करें', logOut: 'लॉग आउट', phone: 'फ़ोन नंबर', emailRequired: 'कृपया अपना ईमेल पता दर्ज करें।', passwordRequired: 'कृपया अपना पासवर्ड दर्ज करें।', invalidCredentials: 'गलत ईमेल या पासवर्ड।' },
  ml: { signIn: 'സൈൻ ഇൻ ചെയ്യുക', createAccount: 'അക്കൗണ്ട് സൃഷ്ടിക്കുക', email: 'ഇമെയിൽ', password: 'പാസ്‌വേഡ്', name: 'പേര്', logIn: 'ലോഗിൻ ചെയ്യുക', logOut: 'ലോഗ് ഔട്ട്', phone: 'ഫോൺ നമ്പർ', emailRequired: 'നിങ്ങളുടെ ഇമെയിൽ വിലാസം നൽകുക.', passwordRequired: 'നിങ്ങളുടെ പാസ്‌വേഡ് നൽകുക.', invalidCredentials: 'തെറ്റായ ഇമെയിൽ അല്ലെങ്കിൽ പാസ്‌വേഡ്.' },
  te: { signIn: 'సైన్ ఇన్ చేయండి', createAccount: 'ఖాతా సృష్టించండి', email: 'ఇమెయిల్', password: 'పాస్‌వర్డ్', name: 'పేరు', logIn: 'లాగిన్ చేయండి', logOut: 'లాగ్ అవుట్', phone: 'ఫోన్ నంబర్', emailRequired: 'దయచేసి మీ ఇమెయిల్ చిరునామాను నమోదు చేయండి.', passwordRequired: 'దయచేసి మీ పాస్‌వర్డ్‌ను నమోదు చేయండి.', invalidCredentials: 'తప్పు ఇమెయిల్ లేదా పాస్‌వర్డ్.' },
  kn: { signIn: 'ಸೈನ್ ಇನ್ ಮಾಡಿ', createAccount: 'ಖಾತೆ ರಚಿಸಿ', email: 'ಇಮೇಲ್', password: 'ಪಾಸ್‌ವರ್ಡ್', name: 'ಹೆಸರು', logIn: 'ಲಾಗ್ ಇನ್ ಮಾಡಿ', logOut: 'ಲಾಗ್ ಔಟ್', phone: 'ಫೋನ್ ಸಂಖ್ಯೆ', emailRequired: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಇಮೇಲ್ ವಿಳಾಸವನ್ನು ನಮೂದಿಸಿ.', passwordRequired: 'ದಯವಿಟ್ಟು ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.', invalidCredentials: 'ತಪ್ಪಾದ ಇಮೇಲ್ ಅಥವಾ ಪಾಸ್‌ವರ್ಡ್.' },
};

const checkout = {
  en: { customerInfo: 'Customer information', address: 'Address', deliveryAddress: 'Delivery address', paymentMethod: 'Payment method', orderSummary: 'Order summary', placeOrder: 'Place order', paymentSuccessful: 'Payment successful', paymentFailed: 'Payment failed', addAddress: 'Add address' },
  ta: { customerInfo: 'வாடிக்கையாளர் தகவல்', address: 'முகவரி', deliveryAddress: 'டெலிவரி முகவரி', paymentMethod: 'கட்டண முறை', orderSummary: 'ஆர்டர் சுருக்கம்', placeOrder: 'ஆர்டர் செய்யவும்', paymentSuccessful: 'கட்டணம் வெற்றிகரமாக முடிந்தது', paymentFailed: 'கட்டணம் தோல்வியடைந்தது', addAddress: 'முகவரி சேர்' },
  hi: { customerInfo: 'ग्राहक जानकारी', address: 'पता', deliveryAddress: 'डिलीवरी पता', paymentMethod: 'भुगतान विधि', orderSummary: 'ऑर्डर सारांश', placeOrder: 'ऑर्डर करें', paymentSuccessful: 'भुगतान सफल', paymentFailed: 'भुगतान असफल', addAddress: 'पता जोड़ें' },
  ml: { customerInfo: 'ഉപഭോക്തൃ വിവരങ്ങൾ', address: 'വിലാസം', deliveryAddress: 'ഡെലിവറി വിലാസം', paymentMethod: 'പേയ്‌മെന്റ് രീതി', orderSummary: 'ഓർഡർ സംഗ്രഹം', placeOrder: 'ഓർഡർ ചെയ്യുക', paymentSuccessful: 'പേയ്‌മെന്റ് വിജയകരം', paymentFailed: 'പേയ്‌മെന്റ് പരാജയപ്പെട്ടു', addAddress: 'വിലാസം ചേർക്കുക' },
  te: { customerInfo: 'కస్టమర్ సమాచారం', address: 'చిరునామా', deliveryAddress: 'డెలివరీ చిరునామా', paymentMethod: 'చెల్లింపు విధానం', orderSummary: 'ఆర్డర్ సారాంశం', placeOrder: 'ఆర్డర్ చేయండి', paymentSuccessful: 'చెల్లింపు విజయవంతమైంది', paymentFailed: 'చెల్లింపు విఫలమైంది', addAddress: 'చిరునామా జోడించండి' },
  kn: { customerInfo: 'ಗ್ರಾಹಕ ಮಾಹಿತಿ', address: 'ವಿಳಾಸ', deliveryAddress: 'ಡೆಲಿವರಿ ವಿಳಾಸ', paymentMethod: 'ಪಾವತಿ ವಿಧಾನ', orderSummary: 'ಆರ್ಡರ್ ಸಾರಾಂಶ', placeOrder: 'ಆರ್ಡರ್ ಮಾಡಿ', paymentSuccessful: 'ಪಾವತಿ ಯಶಸ್ವಿಯಾಗಿದೆ', paymentFailed: 'ಪಾವತಿ ವಿಫಲವಾಗಿದೆ', addAddress: 'ವಿಳಾಸ ಸೇರಿಸಿ' },
};

const orders = {
  en: { myOrders: 'My orders', orderId: 'Order ID', orderDate: 'Order date', trackOrder: 'Track order', viewDetails: 'View details', statuses: { 'Order Placed': 'Order Placed', 'Order Confirmed': 'Order Confirmed', 'Order Processing': 'Order Processing', Packed: 'Packed', Shipped: 'Shipped', 'Out for Delivery': 'Out for Delivery', Delivered: 'Delivered', Cancelled: 'Cancelled' } },
  ta: { myOrders: 'எனது ஆர்டர்கள்', orderId: 'ஆர்டர் ஐடி', orderDate: 'ஆர்டர் தேதி', trackOrder: 'ஆர்டரை கண்காணிக்கவும்', viewDetails: 'விவரங்களைக் காண்க', statuses: { 'Order Placed': 'ஆர்டர் செய்யப்பட்டது', 'Order Confirmed': 'ஆர்டர் உறுதி செய்யப்பட்டது', 'Order Processing': 'ஆர்டர் தயாராகிறது', Packed: 'பேக் செய்யப்பட்டது', Shipped: 'அனுப்பப்பட்டது', 'Out for Delivery': 'டெலிவரிக்கு புறப்பட்டது', Delivered: 'டெலிவரி செய்யப்பட்டது', Cancelled: 'ரத்து செய்யப்பட்டது' } },
  hi: { myOrders: 'मेरे ऑर्डर', orderId: 'ऑर्डर आईडी', orderDate: 'ऑर्डर तिथि', trackOrder: 'ऑर्डर ट्रैक करें', viewDetails: 'विवरण देखें', statuses: { 'Order Placed': 'ऑर्डर दिया गया', 'Order Confirmed': 'ऑर्डर की पुष्टि हुई', 'Order Processing': 'ऑर्डर तैयार हो रहा है', Packed: 'पैक किया गया', Shipped: 'भेज दिया गया', 'Out for Delivery': 'डिलीवरी के लिए निकल गया', Delivered: 'डिलीवर हो गया', Cancelled: 'रद्द किया गया' } },
  ml: { myOrders: 'എന്റെ ഓർഡറുകൾ', orderId: 'ഓർഡർ ഐഡി', orderDate: 'ഓർഡർ തീയതി', trackOrder: 'ഓർഡർ ട്രാക്ക് ചെയ്യുക', viewDetails: 'വിശദാംശങ്ങൾ കാണുക', statuses: { 'Order Placed': 'ഓർഡർ ചെയ്തു', 'Order Confirmed': 'ഓർഡർ സ്ഥിരീകരിച്ചു', 'Order Processing': 'ഓർഡർ തയ്യാറാകുന്നു', Packed: 'പാക്ക് ചെയ്തു', Shipped: 'അയച്ചു', 'Out for Delivery': 'ഡെലിവറിക്ക് പുറപ്പെട്ടു', Delivered: 'ഡെലിവർ ചെയ്തു', Cancelled: 'റദ്ദാക്കി' } },
  te: { myOrders: 'నా ఆర్డర్‌లు', orderId: 'ఆర్డర్ ఐడి', orderDate: 'ఆర్డర్ తేదీ', trackOrder: 'ఆర్డర్‌ను ట్రాక్ చేయండి', viewDetails: 'వివరాలు చూడండి', statuses: { 'Order Placed': 'ఆర్డర్ చేయబడింది', 'Order Confirmed': 'ఆర్డర్ నిర్ధారించబడింది', 'Order Processing': 'ఆర్డర్ సిద్ధమవుతోంది', Packed: 'ప్యాక్ చేయబడింది', Shipped: 'పంపబడింది', 'Out for Delivery': 'డెలివరీకి బయలుదేరింది', Delivered: 'డెలివరీ చేయబడింది', Cancelled: 'రద్దు చేయబడింది' } },
  kn: { myOrders: 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು', orderId: 'ಆರ್ಡರ್ ಐಡಿ', orderDate: 'ಆರ್ಡರ್ ದಿನಾಂಕ', trackOrder: 'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ', viewDetails: 'ವಿವರಗಳನ್ನು ವೀಕ್ಷಿಸಿ', statuses: { 'Order Placed': 'ಆರ್ಡರ್ ಮಾಡಲಾಗಿದೆ', 'Order Confirmed': 'ಆರ್ಡರ್ ದೃಢಪಡಿಸಲಾಗಿದೆ', 'Order Processing': 'ಆರ್ಡರ್ ಸಿದ್ಧವಾಗುತ್ತಿದೆ', Packed: 'ಪ್ಯಾಕ್ ಮಾಡಲಾಗಿದೆ', Shipped: 'ರವಾನಿಸಲಾಗಿದೆ', 'Out for Delivery': 'ಡೆಲಿವರಿಗೆ ಹೊರಟಿದೆ', Delivered: 'ಡೆಲಿವರಿ ಆಗಿದೆ', Cancelled: 'ರದ್ದುಗೊಳಿಸಲಾಗಿದೆ' } },
};

const common = {
  en: { addToCart: 'Add to cart', buyNow: 'Buy now', viewDetails: 'Details', trackOrder: 'Track order', outOfStock: 'Out of stock', lowStock: 'Low stock', clearFilters: 'Clear filters', noProductsFound: 'No products found', tryDifferentSearch: 'Try a different word, or check the spelling.', loading: 'Loading...', submit: 'Submit', cancel: 'Cancel', save: 'Save', delete: 'Delete', edit: 'Edit', confirm: 'Confirm', close: 'Close', back: 'Back', next: 'Next', previous: 'Previous', continueLabel: 'Continue', retry: 'Retry', success: 'Success', error: 'Something went wrong. Please try again.' },
  ta: { addToCart: 'கார்ட்டில் சேர்', buyNow: 'இப்போது வாங்கு', viewDetails: 'விவரங்கள்', trackOrder: 'ஆர்டரை கண்காணிக்கவும்', outOfStock: 'கையிருப்பில் இல்லை', lowStock: 'கையிருப்பு குறைவு', clearFilters: 'வடிகட்டிகளை அழிக்கவும்', noProductsFound: 'தயாரிப்புகள் எதுவும் இல்லை', tryDifferentSearch: 'வேறு வார்த்தையை முயற்சிக்கவும், அல்லது எழுத்துப்பிழையை சரிபார்க்கவும்.', loading: 'ஏற்றுகிறது...', submit: 'சமர்ப்பிக்கவும்', cancel: 'ரத்து செய்', save: 'சேமி', delete: 'நீக்கு', edit: 'திருத்து', confirm: 'உறுதிப்படுத்து', close: 'மூடு', back: 'பின்செல்', next: 'அடுத்து', previous: 'முந்தைய', continueLabel: 'தொடரவும்', retry: 'மீண்டும் முயற்சி', success: 'வெற்றி', error: 'ஏதோ தவறு நடந்தது. மீண்டும் முயற்சிக்கவும்.' },
  hi: { addToCart: 'कार्ट में जोड़ें', buyNow: 'अभी खरीदें', viewDetails: 'विवरण', trackOrder: 'ऑर्डर ट्रैक करें', outOfStock: 'स्टॉक में नहीं', lowStock: 'सीमित स्टॉक', clearFilters: 'फ़िल्टर हटाएं', noProductsFound: 'कोई उत्पाद नहीं मिला', tryDifferentSearch: 'कोई अन्य शब्द आज़माएं, या वर्तनी जांचें।', loading: 'लोड हो रहा है...', submit: 'सबमिट करें', cancel: 'रद्द करें', save: 'सहेजें', delete: 'हटाएं', edit: 'संपादित करें', confirm: 'पुष्टि करें', close: 'बंद करें', back: 'वापस', next: 'अगला', previous: 'पिछला', continueLabel: 'जारी रखें', retry: 'पुनः प्रयास करें', success: 'सफल', error: 'कुछ गलत हो गया। कृपया पुनः प्रयास करें।' },
  ml: { addToCart: 'കാർട്ടിൽ ചേർക്കുക', buyNow: 'ഇപ്പോൾ വാങ്ങുക', viewDetails: 'വിശദാംശങ്ങൾ', trackOrder: 'ഓർഡർ ട്രാക്ക് ചെയ്യുക', outOfStock: 'സ്റ്റോക്ക് ഇല്ല', lowStock: 'സ്റ്റോക്ക് കുറവാണ്', clearFilters: 'ഫിൽട്ടറുകൾ മായ്ക്കുക', noProductsFound: 'ഉൽപ്പന്നങ്ങളൊന്നും കണ്ടെത്തിയില്ല', tryDifferentSearch: 'മറ്റൊരു വാക്ക് ശ്രമിക്കുക, അല്ലെങ്കിൽ സ്പെല്ലിംഗ് പരിശോധിക്കുക.', loading: 'ലോഡ് ചെയ്യുന്നു...', submit: 'സമർപ്പിക്കുക', cancel: 'റദ്ദാക്കുക', save: 'സേവ് ചെയ്യുക', delete: 'ഇല്ലാതാക്കുക', edit: 'എഡിറ്റ് ചെയ്യുക', confirm: 'സ്ഥിരീകരിക്കുക', close: 'അടയ്ക്കുക', back: 'തിരികെ', next: 'അടുത്തത്', previous: 'മുമ്പത്തെ', continueLabel: 'തുടരുക', retry: 'വീണ്ടും ശ്രമിക്കുക', success: 'വിജയം', error: 'എന്തോ പിശക് സംഭവിച്ചു. വീണ്ടും ശ്രമിക്കുക.' },
  te: { addToCart: 'కార్ట్‌కు జోడించండి', buyNow: 'ఇప్పుడే కొనండి', viewDetails: 'వివరాలు', trackOrder: 'ఆర్డర్‌ను ట్రాక్ చేయండి', outOfStock: 'స్టాక్‌లో లేదు', lowStock: 'తక్కువ స్టాక్', clearFilters: 'ఫిల్టర్‌లను క్లియర్ చేయండి', noProductsFound: 'ఉత్పత్తులు కనుగొనబడలేదు', tryDifferentSearch: 'వేరే పదాన్ని ప్రయత్నించండి, లేదా స్పెల్లింగ్ తనిఖీ చేయండి.', loading: 'లోడ్ అవుతోంది...', submit: 'సమర్పించండి', cancel: 'రద్దు చేయండి', save: 'సేవ్ చేయండి', delete: 'తొలగించండి', edit: 'సవరించండి', confirm: 'నిర్ధారించండి', close: 'మూసివేయండి', back: 'వెనుకకు', next: 'తదుపరి', previous: 'మునుపటి', continueLabel: 'కొనసాగించండి', retry: 'మళ్ళీ ప్రయత్నించండి', success: 'విజయం', error: 'ఏదో తప్పు జరిగింది. దయచేసి మళ్ళీ ప్రయత్నించండి.' },
  kn: { addToCart: 'ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ', buyNow: 'ಈಗ ಖರೀದಿಸಿ', viewDetails: 'ವಿವರಗಳು', trackOrder: 'ಆರ್ಡರ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ', outOfStock: 'ಸ್ಟಾಕ್ ಇಲ್ಲ', lowStock: 'ಕಡಿಮೆ ಸ್ಟಾಕ್', clearFilters: 'ಫಿಲ್ಟರ್‌ಗಳನ್ನು ತೆರವುಗೊಳಿಸಿ', noProductsFound: 'ಯಾವುದೇ ಉತ್ಪನ್ನಗಳು ಕಂಡುಬಂದಿಲ್ಲ', tryDifferentSearch: 'ಬೇರೆ ಪದವನ್ನು ಪ್ರಯತ್ನಿಸಿ, ಅಥವಾ ಕಾಗುಣಿತ ಪರಿಶೀಲಿಸಿ.', loading: 'ಲೋಡ್ ಆಗುತ್ತಿದೆ...', submit: 'ಸಲ್ಲಿಸಿ', cancel: 'ರದ್ದುಮಾಡಿ', save: 'ಉಳಿಸಿ', delete: 'ಅಳಿಸಿ', edit: 'ಸಂಪಾದಿಸಿ', confirm: 'ದೃಢೀಕರಿಸಿ', close: 'ಮುಚ್ಚಿ', back: 'ಹಿಂದೆ', next: 'ಮುಂದೆ', previous: 'ಹಿಂದಿನ', continueLabel: 'ಮುಂದುವರಿಸಿ', retry: 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ', success: 'ಯಶಸ್ಸು', error: 'ಏನೋ ತಪ್ಪಾಗಿದೆ. ದಯವಿಟ್ಟು ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.' },
};

const wishlist = {
  en: { title: 'Your wishlist', empty: "Nothing saved yet - tap the heart on any product to add it here.", browsePlants: 'Browse plants' },
  ta: { title: 'உங்கள் விருப்பப்பட்டியல்', empty: 'இதுவரை எதுவும் சேமிக்கப்படவில்லை - எந்த தயாரிப்பிலும் இதயத்தை தட்டி இங்கே சேர்க்கவும்.', browsePlants: 'செடிகளை உலாவுக' },
  hi: { title: 'आपकी विशलिस्ट', empty: 'अभी तक कुछ भी सहेजा नहीं गया - किसी भी उत्पाद पर दिल पर टैप करके यहां जोड़ें।', browsePlants: 'पौधे देखें' },
  ml: { title: 'നിങ്ങളുടെ വിഷ്‌ലിസ്റ്റ്', empty: 'ഇതുവരെ ഒന്നും സേവ് ചെയ്തിട്ടില്ല - ഏതെങ്കിലും ഉൽപ്പന്നത്തിലെ ഹൃദയത്തിൽ ടാപ്പ് ചെയ്ത് ഇവിടെ ചേർക്കുക.', browsePlants: 'ചെടികൾ ബ്രൗസ് ചെയ്യുക' },
  te: { title: 'మీ విష్‌లిస్ట్', empty: 'ఇంకా ఏమీ సేవ్ చేయబడలేదు - ఏదైనా ఉత్పత్తిపై హృదయాన్ని నొక్కి ఇక్కడ జోడించండి.', browsePlants: 'మొక్కలను బ్రౌజ్ చేయండి' },
  kn: { title: 'ನಿಮ್ಮ ವಿಶ್‌ಲಿಸ್ಟ್', empty: 'ಇನ್ನೂ ಏನೂ ಉಳಿಸಲಾಗಿಲ್ಲ - ಯಾವುದೇ ಉತ್ಪನ್ನದ ಹೃದಯವನ್ನು ಟ್ಯಾಪ್ ಮಾಡಿ ಇಲ್ಲಿ ಸೇರಿಸಿ.', browsePlants: 'ಸಸ್ಯಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಿ' },
};

function merge(section) {
  const out = {};
  for (const code of LANGUAGES.map((l) => l.code)) out[code] = section[code] ?? section.en;
  return out;
}

const bySection = { nav, search, header, notifications, footer, cart, auth, checkout, orders, common, wishlist };

export const translations = {};
for (const code of LANGUAGES.map((l) => l.code)) {
  translations[code] = {};
  for (const [sectionName, sectionDict] of Object.entries(bySection)) {
    translations[code][sectionName] = merge(sectionDict)[code];
  }
}

export function getTranslation(lang, path) {
  const dict = translations[lang] ?? translations.en;
  const value = path.split('.').reduce((acc, key) => acc?.[key], dict);
  if (value !== undefined && value !== null) return value;
  // Fall back to English for any key not yet translated (never show
  // "undefined", a raw key, or a blank string).
  const fallback = path.split('.').reduce((acc, key) => acc?.[key], translations.en);
  return fallback !== undefined && fallback !== null ? fallback : path;
}
