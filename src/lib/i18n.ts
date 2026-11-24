/**
 * i18n configuration and language resources
 * Supports English and Hindi initially, extensible for more languages
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Language resources - will be loaded dynamically in production
const resources = {
  en: {
    translation: {
      // Navigation & Header
      nav: {
        home: 'Home',
        dailyVerse: 'Daily Verse',
        prayers: 'Prayers',
        topics: 'Topics',
        readingPlans: 'Reading Plans',
        settings: 'Settings',
        search: 'Search',
      },
      // Daily Verse
      dailyVerse: {
        title: 'Verse of the Day',
        subtitle: 'Daily inspiration from God\'s Word',
        previousDay: 'Previous Day',
        nextDay: 'Next Day',
        today: 'Today',
        share: 'Share Verse',
        copy: 'Copy Verse',
        listen: 'Listen',
        translation: 'Translation',
        changeTranslation: 'Change Translation',
        readingPlan: 'Reading Plan',
        verseOfTheDay: 'Verse of the Day',
        reflection: 'Reflection',
        application: 'Application',
        prayer: 'Prayer',
      },
      // Prayers
      prayers: {
        title: 'Prayers',
        subtitle: 'Find prayers for every situation',
        searchPlaceholder: 'Search prayers...',
        categories: 'Categories',
        allTopics: 'All Topics',
        favorites: 'Favorites',
        recent: 'Recent',
        duration: 'Duration',
        addToFavorites: 'Add to Favorites',
        removeFromFavorites: 'Remove from Favorites',
        share: 'Share Prayer',
        copy: 'Copy Prayer',
        listen: 'Listen to Prayer',
        relatedPrayers: 'Related Prayers',
        noPrayersFound: 'No prayers found for this topic',
        prayWithMe: 'Pray with Me',
        amen: 'Amen',
      },
      // Topics
      topics: {
        title: 'Prayer Topics',
        subtitle: 'Browse prayers by category',
        browseAll: 'Browse All Topics',
        popularTopics: 'Popular Topics',
        subtopics: 'Subtopics',
        prayersInTopic: '{{count}} prayers',
      },
      // Settings
      settings: {
        title: 'Settings',
        subtitle: 'Customize your experience',
        language: 'Language',
        selectLanguage: 'Select Language',
        translation: 'Bible Translation',
        selectTranslation: 'Select Translation',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        system: 'System',
        fontSize: 'Font Size',
        small: 'Small',
        medium: 'Medium',
        large: 'Large',
        extraLarge: 'Extra Large',
        notifications: 'Notifications',
        dailyVerseNotification: 'Daily Verse Reminder',
        prayerReminders: 'Prayer Reminders',
        notificationTime: 'Notification Time',
        audio: 'Audio',
        autoPlayAudio: 'Auto-play Audio',
        offline: 'Offline',
        enableOffline: 'Enable Offline Mode',
        syncData: 'Sync Data',
        clearCache: 'Clear Cache',
        about: 'About',
        version: 'Version',
        privacyPolicy: 'Privacy Policy',
        termsOfService: 'Terms of Service',
        contactUs: 'Contact Us',
        sendFeedback: 'Send Feedback',
        resetSettings: 'Reset to Defaults',
      },
      // Language Names
      languages: {
        en: 'English',
        hi: 'हिन्दी',
        ta: 'தமிழ்',
        te: 'తెలుగు',
        bn: 'বাংলা',
        mr: 'मराठी',
        gu: 'ગુજરાતી',
        kn: 'ಕನ್ನಡ',
        ml: 'മലയാളം',
        or: 'ଓଡ଼ିଆ',
        pa: 'ਪੰਜਾਬੀ',
        ur: 'اردو',
      },
      // Common UI
      common: {
        loading: 'Loading...',
        error: 'Something went wrong',
        retry: 'Try Again',
        save: 'Save',
        cancel: 'Cancel',
        confirm: 'Confirm',
        delete: 'Delete',
        edit: 'Edit',
        close: 'Close',
        back: 'Back',
        next: 'Next',
        previous: 'Previous',
        done: 'Done',
        ok: 'OK',
        yes: 'Yes',
        no: 'No',
        search: 'Search',
        filter: 'Filter',
        sort: 'Sort',
        clear: 'Clear',
        apply: 'Apply',
        refresh: 'Refresh',
        share: 'Share',
        copy: 'Copy',
        copied: 'Copied!',
        copiedToClipboard: 'Copied to clipboard',
        shareCopied: 'Link copied to clipboard',
        noResults: 'No results found',
        emptyState: 'Nothing here yet',
        comingSoon: 'Coming Soon',
        beta: 'Beta',
        new: 'New',
        updated: 'Updated',
        today: 'Today',
        yesterday: 'Yesterday',
        tomorrow: 'Tomorrow',
        week: 'Week',
        month: 'Month',
        year: 'Year',
      },
      // Errors
      errors: {
        networkError: 'Network error. Please check your connection.',
        verseNotFound: 'Verse not found for this date.',
        prayerNotFound: 'Prayer not found.',
        translationNotAvailable: 'This translation is not available in your language.',
        audioNotAvailable: 'Audio not available for this verse.',
        offlineMode: 'You are offline. Some features may be limited.',
        syncFailed: 'Failed to sync data. Please try again.',
        permissionDenied: 'Permission denied.',
        unknownError: 'An unknown error occurred.',
      },
      // Accessibility
      a11y: {
        skipToContent: 'Skip to main content',
        openMenu: 'Open menu',
        closeMenu: 'Close menu',
        openSettings: 'Open settings',
        closeSettings: 'Close settings',
        playAudio: 'Play audio',
        pauseAudio: 'Pause audio',
        verseText: 'Verse text',
        prayerText: 'Prayer text',
        shareVerse: 'Share verse',
        sharePrayer: 'Share prayer',
        changeLanguage: 'Change language',
        changeTheme: 'Change theme',
        increaseFontSize: 'Increase font size',
        decreaseFontSize: 'Decrease font size',
      },
      // SEO / Meta
      seo: {
        homeTitle: 'Bible Daily - Daily Verse & Prayers',
        homeDescription: 'Start your day with God\'s Word. Daily Bible verses, topic-based prayers, and reading plans in your language.',
        verseTitle: '{{reference}} - Daily Bible Verse',
        verseDescription: '{{text}} - Daily inspiration from {{translation}}',
        prayersTitle: 'Prayers for {{topic}} - Bible Daily',
        prayersDescription: 'Find prayers for {{topic}}. Browse our collection of topic-based prayers in multiple languages.',
        topicsTitle: 'Prayer Topics - Bible Daily',
        topicsDescription: 'Explore prayer categories including healing, anxiety, gratitude, protection, and more.',
      },
    },
  },
  hi: {
    translation: {
      // Navigation & Header
      nav: {
        home: 'होम',
        dailyVerse: 'दैनिक पद',
        prayers: 'प्रार्थनाएं',
        topics: 'विषय',
        readingPlans: 'पठन योजनाएं',
        settings: 'सेटिंग्स',
        search: 'खोजें',
      },
      // Daily Verse
      dailyVerse: {
        title: 'आज का वचन',
        subtitle: 'परमेश्वर के वचन से दैनिक प्रेरणा',
        previousDay: 'पिछला दिन',
        nextDay: 'अगला दिन',
        today: 'आज',
        share: 'पद साझा करें',
        copy: 'पद कॉपी करें',
        listen: 'सुनें',
        translation: 'अनुवाद',
        changeTranslation: 'अनुवाद बदलें',
        readingPlan: 'पठन योजना',
        verseOfTheDay: 'आज का वचन',
        reflection: 'चिंतन',
        application: 'अनुप्रयोग',
        prayer: 'प्रार्थना',
      },
      // Prayers
      prayers: {
        title: 'प्रार्थनाएं',
        subtitle: 'हर स्थिति के लिए प्रार्थनाएं खोजें',
        searchPlaceholder: 'प्रार्थनाएं खोजें...',
        categories: 'श्रेणियां',
        allTopics: 'सभी विषय',
        favorites: 'पसंदीदा',
        recent: 'हाल के',
        duration: 'अवधि',
        addToFavorites: 'पसंदीदा में जोड़ें',
        removeFromFavorites: 'पसंदीदा से हटाएं',
        share: 'प्रार्थना साझा करें',
        copy: 'प्रार्थना कॉपी करें',
        listen: 'प्रार्थना सुनें',
        relatedPrayers: 'संबंधित प्रार्थनाएं',
        noPrayersFound: 'इस विषय के लिए कोई प्रार्थना नहीं मिली',
        prayWithMe: 'मेरे साथ प्रार्थना करें',
        amen: 'आमीन',
      },
      // Topics
      topics: {
        title: 'प्रार्थना विषय',
        subtitle: 'श्रेणी के अनुसार प्रार्थनाएं ब्राउज़ करें',
        browseAll: 'सभी विषय देखें',
        popularTopics: 'लोकप्रिय विषय',
        subtopics: 'उप-विषय',
        prayersInTopic: '{{count}} प्रार्थनाएं',
      },
      // Settings
      settings: {
        title: 'सेटिंग्स',
        subtitle: 'अपना अनुभव अनुकूलित करें',
        language: 'भाषा',
        selectLanguage: 'भाषा चुनें',
        translation: 'बाइबल अनुवाद',
        selectTranslation: 'अनुवाद चुनें',
        theme: 'थीम',
        light: 'हल्का',
        dark: 'गहरा',
        system: 'सिस्टम',
        fontSize: 'फ़ॉन्ट आकार',
        small: 'छोटा',
        medium: 'मध्यम',
        large: 'बड़ा',
        extraLarge: 'अतिरिक्त बड़ा',
        notifications: 'सूचनाएं',
        dailyVerseNotification: 'दैनिक पद अनुस्मारक',
        prayerReminders: 'प्रार्थना अनुस्मारक',
        notificationTime: 'सूचना समय',
        audio: 'ऑडियो',
        autoPlayAudio: 'ऑडियो स्वचालित चलाएं',
        offline: 'ऑफ़लाइन',
        enableOffline: 'ऑफ़लाइन मोड सक्षम करें',
        syncData: 'डेटा सिंक करें',
        clearCache: 'कैश साफ़ करें',
        about: 'परिचय',
        version: 'संस्करण',
        privacyPolicy: 'गोपनीयता नीति',
        termsOfService: 'सेवा की शर्तें',
        contactUs: 'संपर्क करें',
        sendFeedback: 'प्रतिक्रिया भेजें',
        resetSettings: 'डिफ़ॉल्ट पर रीसेट करें',
      },
      // Language Names
      languages: {
        en: 'English',
        hi: 'हिन्दी',
        ta: 'தமிழ்',
        te: 'తెలుగు',
        bn: 'বাংলা',
        mr: 'मराठी',
        gu: 'ગુજરાતી',
        kn: 'ಕನ್ನಡ',
        ml: 'മലയാളം',
        or: 'ଓଡ଼ିଆ',
        pa: 'ਪੰਜਾਬੀ',
        ur: 'اردو',
      },
      // Common UI
      common: {
        loading: 'लोड हो रहा है...',
        error: 'कुछ गलत हो गया',
        retry: 'फिर से कोशिश करें',
        save: 'सेव करें',
        cancel: 'रद्द करें',
        confirm: 'पुष्टि करें',
        delete: 'हटाएं',
        edit: 'संपादित करें',
        close: 'बंद करें',
        back: 'वापस',
        next: 'अगला',
        previous: 'पिछला',
        done: 'हो गया',
        ok: 'ठीक है',
        yes: 'हाँ',
        no: 'नहीं',
        search: 'खोजें',
        filter: 'फ़िल्टर',
        sort: 'क्रमबद्ध करें',
        clear: 'साफ़ करें',
        apply: 'लागू करें',
        refresh: 'रीफ्रेश',
        share: 'साझा करें',
        copy: 'कॉपी करें',
        copied: 'कॉपी हो गया!',
        copiedToClipboard: 'क्लिपबोर्ड पर कॉपी हो गया',
        shareCopied: 'लिंक क्लिपबोर्ड पर कॉपी हो गया',
        noResults: 'कोई परिणाम नहीं मिला',
        emptyState: 'यहां अभी कुछ नहीं है',
        comingSoon: 'जल्द आ रहा है',
        beta: 'बीटा',
        new: 'नया',
        updated: 'अपडेटेड',
        today: 'आज',
        yesterday: 'कल',
        tomorrow: 'कल',
        week: 'सप्ताह',
        month: 'महीना',
        year: 'साल',
      },
      // Errors
      errors: {
        networkError: 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
        verseNotFound: 'इस तारीख के लिए कोई पद नहीं मिला।',
        prayerNotFound: 'प्रार्थना नहीं मिली।',
        translationNotAvailable: 'यह अनुवाद आपकी भाषा में उपलब्ध नहीं है।',
        audioNotAvailable: 'इस पद के लिए ऑडियो उपलब्ध नहीं है।',
        offlineMode: 'आप ऑफ़लाइन हैं। कुछ सुविधाएं सीमित हो सकती हैं।',
        syncFailed: 'डेटा सिंक करने में विफल। कृपया पुनः प्रयास करें।',
        permissionDenied: 'अनुमति अस्वीकृत।',
        unknownError: 'अज्ञात त्रुटि हुई।',
      },
      // Accessibility
      a11y: {
        skipToContent: 'मुख्य सामग्री पर जाएं',
        openMenu: 'मेनू खोलें',
        closeMenu: 'मेनू बंद करें',
        openSettings: 'सेटिंग्स खोलें',
        closeSettings: 'सेटिंग्स बंद करें',
        playAudio: 'ऑडियो चलाएं',
        pauseAudio: 'ऑडियो रोकें',
        verseText: 'पद पाठ',
        prayerText: 'प्रार्थना पाठ',
        shareVerse: 'पद साझा करें',
        sharePrayer: 'प्रार्थना साझा करें',
        changeLanguage: 'भाषा बदलें',
        changeTheme: 'थीम बदलें',
        increaseFontSize: 'फ़ॉन्ट आकार बढ़ाएं',
        decreaseFontSize: 'फ़ॉन्ट आकार घटाएं',
      },
      // SEO / Meta
      seo: {
        homeTitle: 'बाइबल डेली - दैनिक पद और प्रार्थनाएं',
        homeDescription: 'परमेश्वर के वचन से अपना दिन शुरू करें। दैनिक बाइबल पद, विषय-आधारित प्रार्थनाएं, और पठन योजनाएं आपकी भाषा में।',
        verseTitle: '{{reference}} - दैनिक बाइबल पद',
        verseDescription: '{{text}} - {{translation}} से दैनिक प्रेरणा',
        prayersTitle: '{{topic}} के लिए प्रार्थनाएं - बाइबल डेली',
        prayersDescription: '{{topic}} के लिए प्रार्थनाएं खोजें। कई भाषाओं में विषय-आधारित प्रार्थनाओं का हमारा संग्रह ब्राउज़ करें।',
        topicsTitle: 'प्रार्थना विषय - बाइबल डेली',
        topicsDescription: 'चिकित्सा, चिंता, कृतज्ञता, सुरक्षा, और अधिक सहित प्रार्थना श्रेणियों का अन्वेषण करें।',
      },
    },
  },
};

export const supportedLanguages = ['en', 'hi'] as const;
export type SupportedLanguage = typeof supportedLanguages[number];

export const defaultLanguage: SupportedLanguage = 'en';

export const languageConfig: Record<SupportedLanguage, {
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  fontFamily: string;
}> = {
  en: {
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    direction: 'ltr',
    fontFamily: 'sans',
  },
  hi: {
    name: 'Hindi',
    nativeName: 'हिन्दी',
    flag: '🇮🇳',
    direction: 'ltr',
    fontFamily: 'hindi',
  },
};

export async function initI18n(language?: SupportedLanguage) {
  const savedLanguage = language || localStorage.getItem('language') as SupportedLanguage || defaultLanguage;

  await i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: savedLanguage,
      fallbackLng: defaultLanguage,
      supportedLngs: supportedLanguages,
      detection: {
        order: ['localStorage', 'navigator', 'htmlTag'],
        caches: ['localStorage'],
        lookupLocalStorage: 'language',
      },
      interpolation: {
        escapeValue: false,
      },
      react: {
        useSuspense: false,
      },
      returnNull: false,
      returnEmptyString: false,
    });

  // Update document direction and lang attribute
  document.documentElement.lang = savedLanguage;
  document.documentElement.dir = languageConfig[savedLanguage].direction;

  return i18n;
}

export function changeLanguage(lang: SupportedLanguage) {
  return i18n.changeLanguage(lang).then(() => {
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = languageConfig[lang].direction;
  });
}

export { i18n };
export default i18n;