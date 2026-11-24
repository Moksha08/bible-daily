/**
 * Daily Verse Component - Core feature component
 */

import { useState } from 'react';
import { formatDate } from '@/lib/utils';
import { useDailyVerse } from '@/hooks/useDailyVerse';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Modal } from '@/components/ui/Modal';
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Copy,
  Volume2,
  BookOpen,
  Heart,
  Sun,
  Moon,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function DailyVerseDisplay() {
  const { language, currentTranslation, resolvedTheme, toggleFavoriteVerse, isFavoriteVerse } = useApp();
  const { verse, previousDate, nextDate, loading, error, goToDate, refetch } = useDailyVerse();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  if (loading) {
    return (
      <Card variant="elevated" padding="lg" className="animate-pulse">
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
        </div>
      </Card>
    );
  }

  if (error || !verse) {
    return (
      <Card variant="elevated" padding="lg" className="text-center">
        <div className="text-gray-500 dark:text-gray-400 mb-4">
          <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">Unable to load verse</p>
          <p className="text-sm mt-1">{error || 'No verse available for this date'}</p>
        </div>
        <Button onClick={refetch} variant="outline">
          Try Again
        </Button>
      </Card>
    );
  }

  const verseId = `${verse.reference}-${verse.date}`;
  const isFav = isFavoriteVerse(verseId);

  const handleShare = async () => {
    const text = `"${verse.text}"\n\n— ${verse.reference} (${verse.translation})`;
    try {
      await navigator.share({
        title: `Daily Verse - ${verse.reference}`,
        text,
        url: window.location.href,
      });
    } catch {
      // Fallback to clipboard
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowShareModal(false);
  };

  const handleCopy = async () => {
    const text = `"${verse.text}"\n\n— ${verse.reference} (${verse.translation})`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAudio = () => {
    // In production, this would play actual audio
    setAudioPlaying(true);
    setTimeout(() => setAudioPlaying(false), 3000);
  };

  const handleFavorite = () => {
    toggleFavoriteVerse(verse);
  };

  const formattedDate = formatDate(verse.date, language === 'hi' ? 'hi-IN' : 'en-US');

  return (
    <Card variant="elevated" padding="lg" className="relative overflow-hidden">
      {/* Background decorative element */}
      <div className="absolute top-0 right-0 opacity-5 hidden lg:block">
        <Sparkles className="h-32 w-32 text-primary-500" />
      </div>

      {/* Date and Translation */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span className="font-medium">{formattedDate}</span>
          <span>•</span>
          <span>{verse.translation}</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => previousDate && goToDate(new Date(previousDate))}
            disabled={!previousDate}
            aria-label="Previous day"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => nextDate && goToDate(new Date(nextDate))}
            disabled={!nextDate}
            aria-label="Next day"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Verse Content */}
      <div className="relative z-10">
        <blockquote className="not-italic">
          <p className={cn(
            'text-verse font-serif text-gray-900 dark:text-white leading-relaxed',
            language === 'hi' && 'font-hindi',
            resolvedTheme === 'dark' && 'text-white'
          )}>
            &ldquo;{verse.text}&rdquo;
          </p>
          <footer className="mt-4 text-right">
            <cite className="text-lg font-medium text-gray-700 dark:text-gray-300 not-italic">
              — {verse.reference}
            </cite>
          </footer>
        </blockquote>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 relative z-10">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            className={cn(
              'gap-1.5',
              isFav && 'text-red-600 dark:text-red-400'
            )}
          >
            <Heart className={cn('h-4 w-4', isFav && 'fill-current')} />
            <span className="hidden sm:inline">{isFav ? 'Saved' : 'Save'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            aria-label="Copy verse"
          >
            <Copy className="h-4 w-4" />
            <span className="hidden sm:inline">{copied ? 'Copied!' : 'Copy'}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            aria-label="Share verse"
          >
            <Share2 className="h-4 w-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>

          {verse.audioUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleAudio}
              aria-label={audioPlaying ? 'Pause audio' : 'Play audio'}
            >
              <Volume2 className={cn('h-4 w-4', audioPlaying && 'text-primary-600')} />
              <span className="hidden sm:inline">{audioPlaying ? 'Playing...' : 'Listen'}</span>
            </Button>
          )}
        </div>

        {/* Translation indicator */}
        <div className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
          <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-800 font-medium">
            {currentTranslation.code}
          </span>
        </div>
      </div>

      {/* Share Modal */}
      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Verse"
        size="sm"
      >
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Share this verse with friends and family
          </p>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleShare} className="flex-1">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handleCopy} className="flex-1">
              <Copy className="h-4 w-4 mr-2" />
              Copy Text
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
}

export function DailyVerseCompact() {
  const { verse, loading, error } = useDailyVerse();

  if (loading) {
    return (
      <div className="animate-pulse space-y-2">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded" />
      </div>
    );
  }

  if (error || !verse) return null;

  return (
    <Card variant="outlined" padding="md" className="bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-primary-700 dark:text-primary-300 font-medium mb-1">
            {verse.reference}
          </p>
          <p className="text-verse text-gray-900 dark:text-white line-clamp-3">
            &ldquo;{verse.text}&rdquo;
          </p>
        </div>
        <Sun className="h-8 w-8 text-primary-500 flex-shrink-0 mt-1" />
      </div>
    </Card>
  );
}