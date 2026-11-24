/**
 * Hook for fetching and managing daily verse data
 */

import { useState, useEffect, useCallback } from 'react';
import type { DailyVerseData, BibleVerse, LanguageCode, ApiResponse } from '@/types';
import { getDailyVerse, getVerseByReference } from '@/lib/bible-api';
import { useApp } from '@/context/AppContext';

export function useDailyVerse(date?: Date) {
  const { language, currentTranslation } = useApp();
  const [data, setData] = useState<DailyVerseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVerse = useCallback(async (targetDate: Date = new Date()) => {
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse<DailyVerseData> = await getDailyVerse(
        targetDate,
        language as LanguageCode,
        currentTranslation.code
      );
      if (response.success && response.data) {
        setData(response.data);
      } else {
        setError(response.error || 'Failed to fetch verse');
        setData(null);
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [language, currentTranslation.code]);

  useEffect(() => {
    const targetDate = date || new Date();
    fetchVerse(targetDate);
  }, [date, fetchVerse]);

  const refetch = useCallback(() => {
    const targetDate = date || new Date();
    fetchVerse(targetDate);
  }, [date, fetchVerse]);

  const goToDate = useCallback((targetDate: Date) => {
    fetchVerse(targetDate);
  }, [fetchVerse]);

  return {
    verse: data?.verse || null,
    previousDate: data?.previousDate || null,
    nextDate: data?.nextDate || null,
    loading,
    error,
    refetch,
    goToDate,
  };
}

export function useVerseByReference(reference: string) {
  const { language, currentTranslation } = useApp();
  const [verse, setVerse] = useState<BibleVerse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) return;

    let mounted = true;
    const fetchVerse = async () => {
      setLoading(true);
      setError(null);
      try {
        const response: ApiResponse<BibleVerse> = await getVerseByReference(
          reference,
          language as LanguageCode,
          currentTranslation.code
        );
        if (mounted) {
          if (response.success && response.data) {
            setVerse(response.data);
          } else {
            setError(response.error || 'Verse not found');
            setVerse(null);
          }
        }
      } catch {
        if (mounted) {
          setError('Network error');
          setVerse(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchVerse();
    return () => { mounted = false; };
  }, [reference, language, currentTranslation.code]);

  return { verse, loading, error, refetch: () => {} };
}