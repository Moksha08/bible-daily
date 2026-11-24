/**
 * Global Application Context
 * Manages user preferences, language, theme, and offline state
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { UserPreferences, LanguageCode, BibleTranslation, Prayer, BibleVerse } from '@/types';
import { getPreferredTheme, setTheme } from '@/lib/utils';
import { DEFAULT_TRANSLATIONS, getDefaultTranslation } from '@/lib/bible-api';
import { changeLanguage, supportedLanguages, type SupportedLanguage } from '@/lib/i18n';

interface AppContextType {
  // Preferences
  preferences: UserPreferences;
  updatePreferences: (prefs: Partial<UserPreferences>) => Promise<void>;
  resetPreferences: () => void;

  // Language
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => Promise<void>;
  availableLanguages: SupportedLanguage[];

  // Translations
  currentTranslation: BibleTranslation;
  setTranslation: (code: string) => void;
  availableTranslations: BibleTranslation[];

  // Theme
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  resolvedTheme: 'light' | 'dark';

  // Offline
  isOnline: boolean;
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;

  // Favorites
  favoriteVerses: BibleVerse[];
  favoritePrayers: Prayer[];
  toggleFavoriteVerse: (verse: BibleVerse) => void;
  toggleFavoritePrayer: (prayer: Prayer) => void;
  isFavoriteVerse: (verseId: string) => boolean;
  isFavoritePrayer: (prayerId: string) => boolean;

  // Recently viewed
  recentPrayers: Prayer[];
  addRecentPrayer: (prayer: Prayer) => void;

  // Loading states
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  language: 'en',
  translation: 'ESV',
  theme: 'system',
  fontSize: 'medium',
  notificationsEnabled: true,
  dailyVerseTime: '07:00',
  prayerReminders: false,
  autoPlayAudio: false,
  offlineMode: false,
};

const STORAGE_KEY = 'bible-daily-preferences';
const FAVORITES_KEY = 'bible-daily-favorites';
const RECENT_KEY = 'bible-daily-recent';

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [currentTranslation, setCurrentTranslation] = useState<BibleTranslation>(DEFAULT_TRANSLATIONS.en[0]);
  const [theme, setThemeState] = useState<'light' | 'dark' | 'system'>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [isOnline, setIsOnline] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [favoriteVerses, setFavoriteVerses] = useState<BibleVerse[]>([]);
  const [favoritePrayers, setFavoritePrayers] = useState<Prayer[]>([]);
  const [recentPrayers, setRecentPrayers] = useState<Prayer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [availableTranslations, setAvailableTranslations] = useState<BibleTranslation[]>(DEFAULT_TRANSLATIONS.en);

  // Initialize from localStorage
  useEffect(() => {
    const init = async () => {
      try {
        // Load preferences
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as UserPreferences;
          setPreferences(parsed);
          setThemeState(parsed.theme);
          setLanguageState(parsed.language as SupportedLanguage);
        }

        // Load favorites
        const favVerses = localStorage.getItem(`${FAVORITES_KEY}-verses`);
        if (favVerses) setFavoriteVerses(JSON.parse(favVerses));

        const favPrayers = localStorage.getItem(`${FAVORITES_KEY}-prayers`);
        if (favPrayers) setFavoritePrayers(JSON.parse(favPrayers));

        // Load recent
        const recent = localStorage.getItem(RECENT_KEY);
        if (recent) setRecentPrayers(JSON.parse(recent));

        // Set initial theme
        const prefTheme = getPreferredTheme();
        setResolvedTheme(prefTheme);
        setTheme(prefTheme);

        // Set initial translations based on language
        const lang = (stored ? JSON.parse(stored).language : 'en') as SupportedLanguage;
        setAvailableTranslations(DEFAULT_TRANSLATIONS[lang] || DEFAULT_TRANSLATIONS.en);
        const defaultTrans = getDefaultTranslation(lang);
        setCurrentTranslation(defaultTrans);

        // Initialize i18n
        await changeLanguage(lang);
      } catch (e) {
        console.error('Failed to load preferences:', e);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Online/offline detection
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Theme changes
  useEffect(() => {
    setTheme(theme);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = theme === 'system' ? (prefersDark ? 'dark' : 'light') : theme;
    setResolvedTheme(resolved);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === 'system') {
        const resolved = e.matches ? 'dark' : 'light';
        setResolvedTheme(resolved);
        setTheme(resolved);
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Save preferences
  const updatePreferences = useCallback(async (newPrefs: Partial<UserPreferences>) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

    // Apply changes immediately
    if (newPrefs.theme) setThemeState(newPrefs.theme);
    if (newPrefs.language) {
      await setLanguageState(newPrefs.language as SupportedLanguage);
      await changeLanguage(newPrefs.language as SupportedLanguage);
      setAvailableTranslations(DEFAULT_TRANSLATIONS[newPrefs.language] || DEFAULT_TRANSLATIONS.en);
      const defaultTrans = getDefaultTranslation(newPrefs.language as LanguageCode);
      setCurrentTranslation(defaultTrans);
    }
    if (newPrefs.translation) {
      const trans = availableTranslations.find(t => t.code === newPrefs.translation);
      if (trans) setCurrentTranslation(trans);
    }
  }, [preferences, availableTranslations]);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_PREFERENCES));
    setThemeState('system');
    setLanguageState('en');
    changeLanguage('en');
    setAvailableTranslations(DEFAULT_TRANSLATIONS.en);
    setCurrentTranslation(DEFAULT_TRANSLATIONS.en[0]);
  }, []);

  const setLanguage = useCallback(async (lang: SupportedLanguage) => {
    await changeLanguage(lang);
    setLanguageState(lang);
    setAvailableTranslations(DEFAULT_TRANSLATIONS[lang] || DEFAULT_TRANSLATIONS.en);
    const defaultTrans = getDefaultTranslation(lang);
    setCurrentTranslation(defaultTrans);
    updatePreferences({ language: lang });
  }, [updatePreferences]);

  const setTranslation = useCallback((code: string) => {
    const trans = availableTranslations.find(t => t.code === code);
    if (trans) {
      setCurrentTranslation(trans);
      updatePreferences({ translation: code });
    }
  }, [availableTranslations, updatePreferences]);

  const setTheme = useCallback((newTheme: 'light' | 'dark' | 'system') => {
    setThemeState(newTheme);
    updatePreferences({ theme: newTheme });
  }, [updatePreferences]);

  const toggleOfflineMode = useCallback(() => {
    const newMode = !isOfflineMode;
    setIsOfflineMode(newMode);
    updatePreferences({ offlineMode: newMode });
  }, [isOfflineMode, updatePreferences]);

  // Favorites
  const toggleFavoriteVerse = useCallback((verse: BibleVerse) => {
    setFavoriteVerses(prev => {
      const exists = prev.some(v => v.reference === verse.reference && v.date === verse.date);
      let updated: BibleVerse[];
      if (exists) {
        updated = prev.filter(v => !(v.reference === verse.reference && v.date === verse.date));
      } else {
        updated = [...prev, verse];
      }
      localStorage.setItem(`${FAVORITES_KEY}-verses`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleFavoritePrayer = useCallback((prayer: Prayer) => {
    setFavoritePrayers(prev => {
      const exists = prev.some(p => p.id === prayer.id);
      let updated: Prayer[];
      if (exists) {
        updated = prev.filter(p => p.id !== prayer.id);
      } else {
        updated = [...prev, { ...prayer, isFavorite: true }];
      }
      localStorage.setItem(`${FAVORITES_KEY}-prayers`, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavoriteVerse = useCallback((verseId: string) => {
    return favoriteVerses.some(v => `${v.reference}-${v.date}` === verseId);
  }, [favoriteVerses]);

  const isFavoritePrayer = useCallback((prayerId: string) => {
    return favoritePrayers.some(p => p.id === prayerId);
  }, [favoritePrayers]);

  // Recent prayers
  const addRecentPrayer = useCallback((prayer: Prayer) => {
    setRecentPrayers(prev => {
      const filtered = prev.filter(p => p.id !== prayer.id);
      const updated = [prayer, ...filtered].slice(0, 10);
      localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <AppContext.Provider value={{
      preferences,
      updatePreferences,
      resetPreferences,
      language,
      setLanguage,
      availableLanguages: supportedLanguages,
      currentTranslation,
      setTranslation,
      availableTranslations,
      theme,
      setTheme,
      resolvedTheme,
      isOnline,
      isOfflineMode,
      toggleOfflineMode,
      favoriteVerses,
      favoritePrayers,
      toggleFavoriteVerse,
      toggleFavoritePrayer,
      isFavoriteVerse,
      isFavoritePrayer,
      recentPrayers,
      addRecentPrayer,
      isLoading,
      setLoading,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}