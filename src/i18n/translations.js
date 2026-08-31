// Translation dictionary for the site's UI chrome (nav, header, footer,
// cart, login, notifications, common buttons/messages). Deliberately does
// NOT cover the ~800 real product names/descriptions in the catalogue -
// those are actual business content pulled from Firestore/data/products.js,
// and machine-generating Tamil botanical names for real products would be
// inaccurate and worse than leaving them as-is. Add a `products.*` catalogue
// translation later only with real, reviewed Tamil product copy.
export const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ta', label: 'தமிழ்' },
];

export const translations = {
  en: {
    nav: {
      plants: 'Plants', seeds: 'Seeds', potsPlanters: 'Pots & Planters', plantCare: 'Plant Care',
      landscaping: 'Landscaping', gifting: 'Gifting', b2bSales: 'B2B Sales',
      gardenServices: 'Garden Services', blog: 'Blog', offers: 'Offers', locateStore: 'Locate Store',
    },
    search: {
      placeholders: ['Search plants...', 'Search seeds...', 'Search pots & planters...', 'Search plant care...', 'Search gifting...'],
      ariaLabel: 'Search plants, pots, seeds',
      micSearch: 'Search by voice',
      micListening: 'Listening... click to stop',
      micDenied: 'Microphone access denied.',
      micError: "Couldn't hear that - try again.",
    },
    header: { account: 'Account', wishlist: 'Wishlist', cart: 'Cart', notifications: 'Notifications', language: 'Language' },
    notifications: {
      title: 'Notifications',
      empty: 'No notifications yet - order updates will show up here.',
      markAllRead: 'Mark all as read',
    },
    footer: {
      tagline: 'GROW BETTER • LIVE GREENER',
      description: 'A modern AgriTech nursery bringing plants, seeds, planters and gardening essentials together in one place.',
      shop: 'Shop', discover: 'Discover', account: 'Account',
      rights: 'All rights reserved.', builtFor: 'Built for a greener everyday.',
    },
    cart: {
      title: 'Shopping cart', empty: 'Your cart is waiting for something green.',
      continueShopping: 'Continue shopping', orderSummary: 'Order summary',
      subtotal: 'Subtotal', delivery: 'Delivery', calculatedAtCheckout: 'Calculated at checkout',
      proceedToCheckout: 'Proceed to checkout', remove: 'Remove',
    },
    auth: {
      signIn: 'Sign in', createAccount: 'Create account', email: 'Email', password: 'Password',
      name: 'Name', logIn: 'Log in', logOut: 'Log out',
    },
    common: {
      addToCart: 'Add to cart', viewDetails: 'Details', trackOrder: 'Track order',
      noProductsFound: 'No products found', tryDifferentSearch: 'Try a different word, or check the spelling.',
    },
  },
  ta: {
    nav: {
      plants: 'செடிகள்', seeds: 'விதைகள்', potsPlanters: 'தொட்டிகள் மற்றும் பாட்ஸ்', plantCare: 'செடி பராமரிப்பு',
      landscaping: 'லேண்ட்ஸ்கேப்பிங்', gifting: 'பரிசுகள்', b2bSales: 'B2B விற்பனை',
      gardenServices: 'தோட்ட சேவைகள்', blog: 'வலைப்பதிவு', offers: 'சலுகைகள்', locateStore: 'கடை கண்டறிக',
    },
    search: {
      placeholders: ['செடிகளை தேடுங்கள்...', 'விதைகளை தேடுங்கள்...', 'தொட்டிகளை தேடுங்கள்...', 'செடி பராமரிப்பு தேடுங்கள்...', 'பரிசுகளை தேடுங்கள்...'],
      ariaLabel: 'செடிகள், தொட்டிகள், விதைகளை தேடுங்கள்',
      micSearch: 'குரல் மூலம் தேடுக',
      micListening: 'கேட்கிறது... நிறுத்த கிளிக் செய்யவும்',
      micDenied: 'மைக்ரோஃபோன் அணுகல் மறுக்கப்பட்டது.',
      micError: 'கேட்க முடியவில்லை - மீண்டும் முயற்சிக்கவும்.',
    },
    header: { account: 'கணக்கு', wishlist: 'விருப்பப்பட்டியல்', cart: 'கார்ட்', notifications: 'அறிவிப்புகள்', language: 'மொழி' },
    notifications: {
      title: 'அறிவிப்புகள்',
      empty: 'இதுவரை அறிவிப்புகள் இல்லை - ஆர்டர் புதுப்பிப்புகள் இங்கே காண்பிக்கப்படும்.',
      markAllRead: 'அனைத்தையும் படித்ததாக குறிக்கவும்',
    },
    footer: {
      tagline: 'சிறப்பாக வளருங்கள் • பசுமையாக வாழுங்கள்',
      description: 'செடிகள், விதைகள், தொட்டிகள் மற்றும் தோட்ட தேவைகள் அனைத்தையும் ஒரே இடத்தில் வழங்கும் நவீன அக்ரிடெக் நர்சரி.',
      shop: 'கடை', discover: 'கண்டறியுங்கள்', account: 'கணக்கு',
      rights: 'அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.', builtFor: 'பசுமையான நாளைக்காக உருவாக்கப்பட்டது.',
    },
    cart: {
      title: 'கார்ட்', empty: 'உங்கள் கார்ட் ஏதோ பசுமையானதற்காக காத்திருக்கிறது.',
      continueShopping: 'தொடர்ந்து ஷாப்பிங் செய்யுங்கள்', orderSummary: 'ஆர்டர் சுருக்கம்',
      subtotal: 'மொத்தம்', delivery: 'டெலிவரி', calculatedAtCheckout: 'செக்அவுட்டில் கணக்கிடப்படும்',
      proceedToCheckout: 'செக்அவுட் செய்யவும்', remove: 'நீக்கு',
    },
    auth: {
      signIn: 'உள்நுழையவும்', createAccount: 'கணக்கை உருவாக்கவும்', email: 'மின்னஞ்சல்', password: 'கடவுச்சொல்',
      name: 'பெயர்', logIn: 'உள்நுழையவும்', logOut: 'வெளியேறு',
    },
    common: {
      addToCart: 'கார்ட்டில் சேர்', viewDetails: 'விவரங்கள்', trackOrder: 'ஆர்டரை கண்காணிக்கவும்',
      noProductsFound: 'தயாரிப்புகள் எதுவும் இல்லை', tryDifferentSearch: 'வேறு வார்த்தையை முயற்சிக்கவும், அல்லது எழுத்துப்பிழையை சரிபார்க்கவும்.',
    },
  },
};

export function getTranslation(lang, path) {
  const dict = translations[lang] ?? translations.en;
  const value = path.split('.').reduce((acc, key) => acc?.[key], dict);
  if (value !== undefined) return value;
  // Fall back to English for any key not yet translated, rather than
  // showing a raw key string or blank text.
  return path.split('.').reduce((acc, key) => acc?.[key], translations.en) ?? path;
}
