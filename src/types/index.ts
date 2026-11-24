/**
 * Core type definitions for the Bible Daily application
 */

export interface BibleVerse {
  reference: string;
  text: string;
  translation: string;
  translationCode: string;
  language: LanguageCode;
  date: string; // ISO date string YYYY-MM-DD
  audioUrl?: string;
  copyright?: string;
}

export interface Prayer {
  id: string;
  title: string;
  content: string;
  topic: PrayerTopic;
  language: LanguageCode;
  tags: string[];
  duration?: number; // estimated reading time in seconds
  audioUrl?: string;
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerTopic {
  id: string;
  name: string;
  description: string;
  icon: string; // lucide icon name
  color: string; // tailwind color class
  order: number;
  subtopics?: PrayerSubtopic[];
}

export interface PrayerSubtopic {
  id: string;
  name: string;
  description: string;
  prayerIds: string[];
}

export type LanguageCode = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'mr' | 'gu' | 'kn' | 'ml' | 'or' | 'pa' | 'ur';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
  flag: string;
  direction: 'ltr' | 'rtl';
  fontFamily: string;
  bibleTranslations: BibleTranslation[];
  isEnabled: boolean;
}

export interface BibleTranslation {
  code: string;
  name: string;
  fullName: string;
  copyright: string;
  apiIdentifier: string;
  hasAudio: boolean;
  isDefault: boolean;
}

export interface DailyVerseData {
  verse: BibleVerse;
  previousDate: string;
  nextDate: string;
  readingPlan?: ReadingPlanDay;
}

export interface ReadingPlanDay {
  day: number;
  title: string;
  passages: ReadingPassage[];
  theme?: string;
}

export interface ReadingPassage {
  reference: string;
  startVerse: number;
  endVerse: number;
}

export interface UserPreferences {
  language: LanguageCode;
  translation: string;
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  notificationsEnabled: boolean;
  dailyVerseTime: string; // HH:MM format
  prayerReminders: boolean;
  autoPlayAudio: boolean;
  offlineMode: boolean;
}

export interface ShareCardData {
  verse: BibleVerse;
  backgroundImage?: string;
  template: 'default' | 'minimal' | 'artistic';
  width: number;
  height: number;
}

export interface GeoLocation {
  country: string;
  countryCode: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  suggestedLanguage: LanguageCode;
}

export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
  cached?: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface SearchFilters {
  query?: string;
  topic?: string;
  language?: LanguageCode;
  translation?: string;
  dateFrom?: string;
  dateTo?: string;
  tags?: string[];
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface SEOData {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  twitterCard?: 'summary' | 'summary_large_image';
  jsonLd?: Record<string, unknown>;
}

export interface OfflineData {
  verses: BibleVerse[];
  prayers: Prayer[];
  topics: PrayerTopic[];
  languages: Language[];
  lastSynced: string;
  version: number;
}