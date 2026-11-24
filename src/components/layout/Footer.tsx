/**
 * Footer Component
 */

import { useApp } from '@/context/AppContext';
import { BookOpen, Heart, Compass, Globe, Mail, Github, Twitter, Facebook } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Footer() {
  const { language } = useApp();

  const t = (key: string) => {
    const translations: Record<string, Record<string, string>> = {
      'Bible Daily': { en: 'Bible Daily', hi: 'बाइबल डेली' },
      'Daily verses, prayers, and spiritual growth in your language.': {
        en: 'Daily verses, prayers, and spiritual growth in your language.',
        hi: 'आपकी भाषा में दैनिक पद, प्रार्थनाएं और आध्यात्मिक वृद्धि।'
      },
      'Quick Links': { en: 'Quick Links', hi: 'त्वरित लिंक' },
      'Verse of the Day': { en: 'Verse of the Day', hi: 'आज का वचन' },
      Prayers: { en: 'Prayers', hi: 'प्रार्थनाएं' },
      Topics: { en: 'Topics', hi: 'विषय' },
      'Reading Plans': { en: 'Reading Plans', hi: 'पठन योजनाएं' },
      Resources: { en: 'Resources', hi: 'संसाधन' },
      'Bible Translations': { en: 'Bible Translations', hi: 'बाइबल अनुवाद' },
      'Prayer Guides': { en: 'Prayer Guides', hi: 'प्रार्थना गाइड' },
      'Spiritual Growth': { en: 'Spiritual Growth', hi: 'आध्यात्मिक वृद्धि' },
      'Daily Devotionals': { en: 'Daily Devotionals', hi: 'दैनिक भक्ति' },
      Legal: { en: 'Legal', hi: 'कानूनी' },
      'Privacy Policy': { en: 'Privacy Policy', hi: 'गोपनीयता नीति' },
      'Terms of Service': { en: 'Terms of Service', hi: 'सेवा की शर्तें' },
      'Cookie Policy': { en: 'Cookie Policy', hi: 'कुकी नीति' },
      Connect: { en: 'Connect', hi: 'जुड़ें' },
      'All rights reserved.': { en: 'All rights reserved.', hi: 'सर्वाधिकार सुरक्षित।' },
      'Made with faith': { en: 'Made with faith', hi: 'आस्था के साथ बनाया गया' },
    };
    return translations[key]?.[language] || key;
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    quickLinks: [
      { href: '/', label: t('Verse of the Day'), icon: BookOpen },
      { href: '/prayers', label: t('Prayers'), icon: Heart },
      { href: '/topics', label: t('Topics'), icon: Compass },
      { href: '/reading-plans', label: t('Reading Plans'), icon: BookOpen },
    ],
    resources: [
      { href: '/translations', label: t('Bible Translations') },
      { href: '/prayer-guides', label: t('Prayer Guides') },
      { href: '/spiritual-growth', label: t('Spiritual Growth') },
      { href: '/devotionals', label: t('Daily Devotionals') },
    ],
    legal: [
      { href: '/privacy', label: t('Privacy Policy') },
      { href: '/terms', label: t('Terms of Service') },
      { href: '/cookies', label: t('Cookie Policy') },
    ],
  };

  const socialLinks = [
    { href: 'https://twitter.com', icon: Twitter, label: 'Twitter' },
    { href: 'https://facebook.com', icon: Facebook, label: 'Facebook' },
    { href: 'https://github.com', icon: Github, label: 'GitHub' },
    { href: 'mailto:hello@bibledaily.app', icon: Mail, label: 'Email' },
  ];

  return (
    <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-serif font-bold text-gray-900 dark:text-white">
                {t('Bible Daily')}
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6">
              {t('Daily verses, prayers, and spiritual growth in your language.')}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <nav>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {t('Quick Links')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                  >
                    <link.icon className="h-4 w-4" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Resources */}
          <nav>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {t('Resources')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {t('Legal')}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect / Newsletter */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider mb-4">
              {t('Connect')}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Get the daily verse delivered to your inbox
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
              />
              <button
                type="submit"
                className="px-4 py-2.5 bg-primary-600 text-white rounded-xl hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Subscribe
              </button>
            </form>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} {t('Bible Daily')}. {t('All rights reserved.')}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm flex items-center gap-1">
              <Heart className="h-4 w-4 text-red-500" />
              {t('Made with faith')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}