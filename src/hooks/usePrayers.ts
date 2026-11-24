/**
 * Hooks for managing prayers and topics
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Prayer, PrayerTopic, PrayerSubtopic, LanguageCode } from '@/types';
import { useApp } from '@/context/AppContext';

// Import prayer data
import topicsData from '@/content/prayers/topics.json';
import prayersEn from '@/content/prayers/en/prayers.json';
import prayersHi from '@/content/prayers/hi/prayers.json';

const PRAYERS_BY_LANG = {
  en: prayersEn.prayers,
  hi: prayersHi.prayers,
};

export function usePrayerTopics() {
  const { language } = useApp();
  const [topics, setTopics] = useState<PrayerTopic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTopics(topicsData.topics as PrayerTopic[]);
    setLoading(false);
  }, []);

  return { topics, loading };
}

export function usePrayers(topicId?: string, subtopicId?: string) {
  const { language } = useApp();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPrayers = () => {
      setLoading(true);
      setError(null);
      try {
        const langPrayers = PRAYERS_BY_LANG[language as LanguageCode] || PRAYERS_BY_LANG.en;
        let filtered = langPrayers as Prayer[];

        if (topicId) {
          filtered = filtered.filter(p => p.topic === topicId);
        }
        if (subtopicId) {
          filtered = filtered.filter(p => p.subtopic === subtopicId);
        }

        setPrayers(filtered);
      } catch {
        setError('Failed to load prayers');
        setPrayers([]);
      } finally {
        setLoading(false);
      }
    };

    loadPrayers();
  }, [language, topicId, subtopicId]);

  return { prayers, loading, error };
}

export function usePrayer(prayerId: string) {
  const { language } = useApp();
  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!prayerId) return;

    const loadPrayer = () => {
      setLoading(true);
      setError(null);
      try {
        const langPrayers = PRAYERS_BY_LANG[language as LanguageCode] || PRAYERS_BY_LANG.en;
        const found = (langPrayers as Prayer[]).find(p => p.id === prayerId);
        if (found) {
          setPrayer(found);
        } else {
          setError('Prayer not found');
          setPrayer(null);
        }
      } catch {
        setError('Failed to load prayer');
        setPrayer(null);
      } finally {
        setLoading(false);
      }
    };

    loadPrayer();
  }, [prayerId, language]);

  return { prayer, loading, error };
}

export function usePrayerSearch(query: string) {
  const { language } = useApp();
  const [results, setResults] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      return;
    }

    const search = () => {
      setLoading(true);
      try {
        const langPrayers = PRAYERS_BY_LANG[language as LanguageCode] || PRAYERS_BY_LANG.en;
        const lowerQuery = query.toLowerCase();
        const filtered = (langPrayers as Prayer[]).filter(p =>
          p.title.toLowerCase().includes(lowerQuery) ||
          p.content.toLowerCase().includes(lowerQuery) ||
          p.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
        );
        setResults(filtered.slice(0, 20));
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(search, 300);
    return () => clearTimeout(timeout);
  }, [query, language]);

  return { results, loading };
}

export function useFavoritePrayers() {
  const { favoritePrayers } = useApp();
  return useMemo(() => favoritePrayers, [favoritePrayers]);
}

export function useRecentPrayers() {
  const { recentPrayers } = useApp();
  return useMemo(() => recentPrayers, [recentPrayers]);
}