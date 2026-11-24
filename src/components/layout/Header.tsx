/**
 * Header Component with Navigation
 */

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/Button';
import { Dropdown } from '@/components/ui/Dropdown';
import { Modal } from '@/components/ui/Modal';
import { languageConfig, supportedLanguages, type SupportedLanguage } from '@/lib/i18n';
import { Menu, X, Sun, Moon, Monitor, Globe, BookOpen, Heart, Compass, Settings, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Header() {
  const {
    language,
    setLanguage,
    theme,
    setTheme,
    resolvedTheme,
    preferences,
    updatePreferences,
    availableLanguages,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const t = (key: string) => {
    // Simple translation lookup - in production would use useTranslation
    const translations: Record<string, Record<SupportedLanguage, string>> = {
      'Verse of the Day': { en: 'Verse of the Day', hi: 'आज का वचन' },
      Prayers: { en: 'Prayers', hi: 'प्रार्थनाएं' },
      Topics: { en: 'Topics', hi: 'विषय' },
      'Reading Plans': { en: 'Reading Plans', hi: 'पठन योजनाएं' },
      Settings: { en: 'Settings', hi: 'सेटिंग्स' },
      Language: { en: 'Language', hi: 'भाषा' },
      Theme: { en: 'Theme', hi: 'थीम' },
      Light: { en: 'Light', hi: 'हल्का' },
      Dark: { en: 'Dark', hi: 'गहरा' },
      System: { en: 'System', hi: 'सिस्टम' },
      Notifications: { en: 'Notifications', hi: 'सूचनाएं' },
    };
    return translations[key]?.[language] || key;
  };

  const navItems = [
    { href: '/', label: t('Verse of the Day'), icon: BookOpen },
    { href: '/prayers', label: t('Prayers'), icon: Heart },
    { href: '/topics', label: t('Topics'), icon: Compass },
    { href: '/reading-plans', label: t('Reading Plans'), icon: BookOpen },
  ];

  const languageOptions = availableLanguages.map(lang => ({
    value: lang,
    label: `${languageConfig[lang].flag} ${languageConfig[lang].nativeName}`,
  }));

  const themeOptions = [
    { value: 'light', label: t('Light'), icon: Sun },
    { value: 'dark', label: t('Dark'), icon: Moon },
    { value: 'system', label: t('System'), icon: Monitor },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 dark:bg-surface-dark/80 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800">
      {/* Mobile Menu Button */}
      <div className="lg:hidden px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-serif font-bold text-gray-900 dark:text-white">
              Bible Daily
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center justify-between px-6 py-3" aria-label="Main navigation">
        <div className="flex items-center gap-2">
          <BookOpen className="h-8 w-8 text-primary-600" />
          <span className="text-xl font-serif font-bold text-gray-900 dark:text-white">
            Bible Daily
          </span>
        </div>

        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <Dropdown
            options={languageOptions}
            value={language}
            onChange={setLanguage}
            placeholder="Language"
            triggerClassName="min-w-[140px]"
          />

          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              const themes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system'];
              const currentIndex = themes.indexOf(theme);
              setTheme(themes[(currentIndex + 1) % 3]);
            }}
            aria-label={`Current theme: ${theme}`}
          >
            {resolvedTheme === 'dark' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon" onClick={() => setNotificationsOpen(true)} aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          {/* Settings */}
          <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} aria-label="Settings">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu Modal */}
      <Modal
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        showCloseButton={true}
      >
        <div className="space-y-6">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
              >
                <item.icon className="h-6 w-6" />
                <span className="text-lg font-medium">{item.label}</span>
              </a>
            ))}
          </nav>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Language')}
              </label>
              <Dropdown
                options={languageOptions}
                value={language}
                onChange={setLanguage}
                placeholder="Language"
                fullWidth
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('Theme')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => { setTheme(option.value as 'light' | 'dark' | 'system'); setMobileMenuOpen(false); }}
                    className={cn(
                      'flex flex-col items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all',
                      theme === option.value
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                    )}
                  >
                    <option.icon className="h-6 w-6" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        title={t('Settings')}
        size="lg"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('Language')}</h3>
            <Dropdown
              options={languageOptions}
              value={language}
              onChange={setLanguage}
              placeholder="Select Language"
              fullWidth
            />
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{t('Theme')}</h3>
            <div className="grid grid-cols-3 gap-3">
              {themeOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value as 'light' | 'dark' | 'system')}
                  className={cn(
                    'flex flex-col items-center gap-2 px-4 py-4 rounded-xl border-2 transition-all',
                    theme === option.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  )}
                >
                  <option.icon className="h-7 w-7" />
                  <span className="font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Font Size</h3>
            <div className="flex gap-2">
              {['small', 'medium', 'large', 'extra-large'].map((size) => (
                <button
                  key={size}
                  onClick={() => updatePreferences({ fontSize: size as any })}
                  className={cn(
                    'flex-1 py-3 rounded-xl border-2 transition-all text-sm font-medium',
                    preferences.fontSize === size
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700'
                      : 'border-gray-200 dark:border-gray-700 hover:border-primary-300'
                  )}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Daily Verse Reminder</span>
                <input
                  type="checkbox"
                  checked={preferences.notificationsEnabled}
                  onChange={(e) => updatePreferences({ notificationsEnabled: e.target.checked })}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-gray-700 dark:text-gray-300">Prayer Reminders</span>
                <input
                  type="checkbox"
                  checked={preferences.prayerReminders}
                  onChange={(e) => updatePreferences({ prayerReminders: e.target.checked })}
                  className="w-5 h-5 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
              </label>
            </div>
          </div>
        </div>
      </Modal>

      {/* Notifications Modal */}
      <Modal
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        title={t('Notifications')}
        size="md"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No new notifications
          </p>
          <Button variant="outline" onClick={() => setNotificationsOpen(false)} className="w-full">
            Mark all as read
          </Button>
        </div>
      </Modal>
    </header>
  );
}