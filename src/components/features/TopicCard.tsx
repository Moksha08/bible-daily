/**
 * Topic Card Component for Prayer Categories
 */

import { useApp } from '@/context/AppContext';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { PrayerTopic } from '@/types';
import { ChevronRight } from 'lucide-react';

interface TopicCardProps {
  topic: PrayerTopic;
  prayerCount?: number;
  onClick?: () => void;
  variant?: 'default' | 'featured' | 'compact';
}

const topicIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  sun: () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  'heart-pulse': () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21.395 14.492a1.376 1.376 0 00-1.873-.756l-2.502 1.668a4.13 4.13 0 01-4.902 0L7.11 13.736a1.376 1.376 0 00-1.873.756l-2.011 2.538c-.217.274-.185.713.07.923l4.117 3.293c.401.321.97.37 1.372.117l2.107-2.51a6.509 6.509 0 017.764 0l2.108 2.51c.402.253.971.204 1.372-.117l4.116-3.293c.256-.21.287-.649.07-.923l-2.01-2.538z" /></svg>,
  shield: () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  'cloud-off': () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12.313 5.325A7.5 7.5 0 0121 12a7.5 7.5 0 01-4.302 6.948M15 11a3 3 0 01-5.573 1.681M9 13H7a1 1 0 01-1-1V9a1 1 0 01.553-.894l2-1a1 1 0 011.106 0l2 1A1 1 0 0111 9v1m-2 2v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4a1 1 0 011-1h2m7-2a1 1 0 011 1v3.5M3.227 3.227L1.81 1.81 16.65 16.65a7.5 7.5 0 011.683 3.527m-.777 2.127a60.6 60.6 0 01-3.42 4.803" /></svg>,
  users: () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  compass: () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19l9 2m0 0l2-10m-2 10l-2-10m-2 10l-9 2m9-2l-9-2" /></svg>,
  flame: () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" /></svg>,
  music: () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2M9 19l.517-6.034a1 1 0 011.433-.998l3.782-.41a2 2 0 011.886.326l2.604 2.27a1 1 0 01.177 1.418l-2.329 4.344" /></svg>,
  globe: () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>,
  calendar: () => <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
};

const topicColors: Record<string, string> = {
  accent: 'bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300',
  red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
  blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  pink: 'bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300',
  green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300',
  yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  teal: 'bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-300',
  indigo: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300',
};

export function TopicCard({ topic, prayerCount, onClick, variant = 'default' }: TopicCardProps) {
  const { language } = useApp();
  const IconComponent = topicIcons[topic.icon] || topicIcons.sun;
  const colorClass = topicColors[topic.color] || topicColors.accent;

  const displayName = language === 'hi' && topic.name.includes('Prayer') 
    ? topic.name.replace('Prayer', 'प्रार्थना').replace('Daily', 'दैनिक').replace('Seasonal', 'मौसमी')
    : topic.name;

  if (variant === 'compact') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'w-full text-left p-4 rounded-xl border transition-all duration-200',
          'bg-white dark:bg-gray-800',
          'border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800',
          'hover:shadow-card hover:bg-primary-50 dark:hover:bg-primary-900/20'
        )}
      >
        <div className="flex items-center gap-3">
          <div className={cn('p-2 rounded-lg', colorClass)}>
            <IconComponent />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white truncate">{displayName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{topic.description}</p>
          </div>
          {prayerCount !== undefined && (
            <span className="text-sm text-gray-400 dark:text-gray-500">{prayerCount} prayers</span>
          )}
        </div>
      </button>
    );
  }

  if (variant === 'featured') {
    return (
      <Card variant="elevated" padding="lg" hover onClick={onClick} className="cursor-pointer relative overflow-hidden group">
        <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-10 transition-opacity">
          <IconComponent className="h-24 w-24" style={{ color: `var(--tw-text-opacity)` }} />
        </div>

        <div className="relative z-10">
          <div className={cn('inline-flex p-3 rounded-2xl mb-4', colorClass)}>
            <IconComponent className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{displayName}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{topic.description}</p>
          <div className="flex items-center justify-between">
            {prayerCount !== undefined && (
              <span className="text-sm font-medium text-primary-600 dark:text-primary-400">
                {prayerCount} prayers
              </span>
            )}
            <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="outlined" padding="md" hover onClick={onClick} className="cursor-pointer h-full transition-all">
      <div className="flex items-start gap-4">
        <div className={cn('p-3 rounded-xl flex-shrink-0', colorClass)}>
          <IconComponent className="h-7 w-7" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{displayName}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{topic.description}</p>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
            {prayerCount !== undefined && (
              <span className="flex items-center gap-1 font-medium text-primary-600 dark:text-primary-400">
                {prayerCount} prayers
              </span>
            )}
            {topic.subtopics && topic.subtopics.length > 0 && (
              <span className="flex items-center gap-1">
                {topic.subtopics.length} subtopics
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}

export function TopicGrid({ topics, prayerCounts, onTopicClick, variant = 'default' }: {
  topics: PrayerTopic[];
  prayerCounts?: Record<string, number>;
  onTopicClick?: (topicId: string) => void;
  variant?: 'default' | 'featured' | 'compact';
}) {
  return (
    <div className={cn(
      'grid gap-4',
      variant === 'compact' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
    )}>
      {topics.map((topic) => (
        <TopicCard
          key={topic.id}
          topic={topic}
          prayerCount={prayerCounts?.[topic.id]}
          onClick={() => onTopicClick?.(topic.id)}
          variant={variant}
        />
      ))}
    </div>
  );
}