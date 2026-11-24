/**
 * Prayer Card Component
 */

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Card, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { getReadingTime } from '@/lib/utils';
import {
  Heart,
  Share2,
  Copy,
  Volume2,
  Clock,
  BookOpen,
  Check,
  MoreVertical,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Prayer } from '@/types';

interface PrayerCardProps {
  prayer: Prayer;
  variant?: 'default' | 'compact' | 'featured';
  showTopic?: boolean;
  onPress?: () => void;
}

export function PrayerCard({ prayer, variant = 'default', showTopic = true, onPress }: PrayerCardProps) {
  const { language, resolvedTheme, toggleFavoritePrayer, isFavoritePrayer, addRecentPrayer } = useApp();
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const isFav = isFavoritePrayer(prayer.id);
  const readingTime = prayer.duration || getReadingTime(prayer.content);
  const formattedTime = `${Math.floor(readingTime / 60)}:${(readingTime % 60).toString().padStart(2, '0')}`;

  const handleFavorite = () => {
    toggleFavoritePrayer(prayer);
  };

  const handleCopy = async () => {
    const text = `${prayer.title}\n\n${prayer.content}\n\n— Bible Daily`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    const text = `${prayer.title}\n\n${prayer.content}\n\n— Bible Daily`;
    try {
      await navigator.share({
        title: prayer.title,
        text,
        url: window.location.href,
      });
    } catch {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setShowShareModal(false);
  };

  const handleAudio = () => {
    setAudioPlaying(true);
    setTimeout(() => setAudioPlaying(false), 3000);
  };

  const handlePress = () => {
    addRecentPrayer(prayer);
    onPress?.();
  };

  if (variant === 'compact') {
    return (
      <Card
        variant="outlined"
        padding="md"
        hover
        onClick={handlePress}
        className="cursor-pointer transition-all hover:shadow-card"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate pr-4">
              {prayer.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {prayer.content}
            </p>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formattedTime}
              </span>
              {showTopic && (
                <span className="px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  {prayer.topic}
                </span>
              )}
            </div>
          </div>
          <Heart
            className={cn(
              'h-5 w-5 flex-shrink-0 transition-colors',
              isFav ? 'fill-red-500 text-red-500' : 'text-gray-400'
            )}
          />
        </div>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card variant="elevated" padding="lg" className="relative overflow-hidden">
        <div className="absolute top-0 right-0 opacity-5">
          <BookOpen className="h-24 w-24 text-primary-500" />
        </div>

        <div className="relative z-10">
          {showTopic && (
            <span className="inline-block px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-sm font-medium mb-3">
              {prayer.topic}
            </span>
          )}

          <h2 className="text-2xl font-serif font-semibold text-gray-900 dark:text-white mb-4">
            {prayer.title}
          </h2>

          <div className="prose prose-gray dark:prose-invert max-w-none mb-6">
            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
              {prayer.content}
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {formattedTime} min read
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={handleFavorite} aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}>
                <Heart className={cn('h-5 w-5', isFav && 'fill-current text-red-500')} />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleCopy} aria-label="Copy prayer">
                <Copy className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setShowShareModal(true)} aria-label="Share prayer">
                <Share2 className="h-5 w-5" />
              </Button>
              {prayer.audioUrl && (
                <Button variant="ghost" size="icon" onClick={handleAudio} aria-label={audioPlaying ? 'Pause' : 'Play audio'}>
                  <Volume2 className={cn('h-5 w-5', audioPlaying && 'text-primary-600')} />
                </Button>
              )}
            </div>
          </div>
        </div>

        <Modal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title="Share Prayer"
          size="sm"
        >
          <div className="space-y-3">
            <Button variant="outline" onClick={handleShare} className="w-full justify-center">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" onClick={handleCopy} className="w-full justify-center">
              <Copy className="h-4 w-4 mr-2" />
              Copy Text
            </Button>
          </div>
        </Modal>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="md" hover onClick={handlePress} className="cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {showTopic && (
            <span className="inline-block px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 text-xs font-medium mb-2">
              {prayer.topic}
            </span>
          )}
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
            {prayer.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-3">
            {prayer.content}
          </p>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formattedTime}
            </span>
            {prayer.tags.length > 0 && (
              <span className="flex items-center gap-1">
                <span className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-[10px]">
                  {prayer.tags[0]}
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); handleFavorite(); }}
            aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
            className={cn(
              'p-1.5',
              isFav && 'text-red-600 dark:text-red-400'
            )}
          >
            <Heart className={cn('h-5 w-5', isFav && 'fill-current')} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => { e.stopPropagation(); setShowMore(true); }}
            aria-label="More options"
          >
            <MoreVertical className="h-5 w-5 text-gray-400" />
          </Button>
        </div>
      </div>

      <Modal
        isOpen={showMore}
        onClose={() => setShowMore(false)}
        title={prayer.title}
        size="sm"
      >
        <div className="space-y-3">
          <Button variant="outline" onClick={() => { handleCopy(); setShowMore(false); }} className="w-full justify-start gap-3">
            <Copy className="h-4 w-4" />
            Copy Prayer
          </Button>
          <Button variant="outline" onClick={() => { setShowShareModal(true); setShowMore(false); }} className="w-full justify-start gap-3">
            <Share2 className="h-4 w-4" />
            Share Prayer
          </Button>
          <Button variant="outline" onClick={() => { handleFavorite(); setShowMore(false); }} className="w-full justify-start gap-3">
            <Heart className={cn('h-4 w-4', isFav && 'fill-current text-red-500')} />
            {isFav ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
          {prayer.audioUrl && (
            <Button variant="outline" onClick={handleAudio} className="w-full justify-start gap-3">
              <Volume2 className="h-4 w-4" />
              {audioPlaying ? 'Playing...' : 'Listen'}
            </Button>
          )}
        </div>
      </Modal>

      <Modal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        title="Share Prayer"
        size="sm"
      >
        <div className="space-y-3">
          <Button variant="outline" onClick={handleShare} className="w-full justify-center">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={handleCopy} className="w-full justify-center">
            <Copy className="h-4 w-4 mr-2" />
            Copy Text
          </Button>
        </div>
      </Modal>
    </Card>
  );
}

export function PrayerList({ prayers, topic, emptyMessage = 'No prayers found' }: { prayers: Prayer[]; topic?: string; emptyMessage?: string }) {
  if (prayers.length === 0) {
    return (
      <Card variant="outlined" padding="lg" className="text-center">
        <BookOpen className="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {prayers.map((prayer) => (
        <PrayerCard key={prayer.id} prayer={prayer} showTopic={!!topic} />
      ))}
    </div>
  );
}