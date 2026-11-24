# Bible Daily 📖

A professional, modern Bible website with daily verses, auto-language detection, and topic-based prayers. Built with Astro, React, TypeScript, and Tailwind CSS.

## ✨ Features

- **📅 Daily Verse** - Lectionary-based verse of the day with multiple translations
- **🙏 Topic-Based Prayers** - 100+ prayers organized by category (healing, anxiety, guidance, relationships, etc.)
- **🌍 Auto-Language Detection** - Detects user's country/language automatically (Hindi + English, more coming)
- **🌙 Dark/Light Mode** - System-aware with manual override
- **📱 PWA Ready** - Installable, offline-first with service worker
- **♿ Accessible** - WCAG 2.1 AA compliant, screen reader friendly
- **🔒 Privacy-First** - No tracking, localStorage only, GDPR/PDPB compliant

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Astro 4.x (Static Site Generation) |
| UI | React 18 + TypeScript |
| Styling | Tailwind CSS 3.x |
| i18n | i18next + react-i18next |
| State | React Context + localStorage |
| Icons | Lucide React |
| Deployment | Netlify / Vercel / Cloudflare Pages |

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17+
- npm / pnpm / yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/bible-daily.git
cd bible-daily

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:4321` to see the app.

### Environment Variables

Create a `.env` file for API keys (optional - works with local data):

```env
# ESV API (free, 500 requests/day)
ESV_API_KEY=your_esv_api_key

# API.Bible (Faithlife) - for audio and more translations
API_BIBLE_KEY=your_api_bible_key
```

## 📁 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Card, Modal, etc.)
│   ├── features/        # Feature components (DailyVerse, PrayerCard, TopicCard)
│   └── layout/          # Layout components (Header, Footer)
├── context/
│   └── AppContext.tsx   # Global state (preferences, language, theme, favorites)
├── hooks/
│   ├── useDailyVerse.ts # Daily verse data fetching
│   └── usePrayers.ts    # Prayer data management
├── lib/
│   ├── i18n.ts          # Internationalization setup
│   ├── bible-api.ts     # Bible API integrations
│   └── utils.ts         # Utility functions
├── content/
│   └── prayers/         # Prayer data (JSON per language)
├── layouts/
│   └── MainLayout.astro # Base layout with SEO
├── pages/
│   ├── index.astro      # Home page
│   ├── prayers.astro    # Prayers listing
│   ├── topics.astro     # Prayer topics
│   └── settings.astro   # User settings
└── types/
    └── index.ts         # TypeScript type definitions
```

## 🌐 Supported Languages

| Code | Language | Native Name | Status |
|------|----------|-------------|--------|
| `en` | English | English | ✅ Complete |
| `hi` | Hindi | हिन्दी | ✅ Complete |
| `ta` | Tamil | தமிழ் | 🔜 Planned |
| `te` | Telugu | తెలుగు | 🔜 Planned |
| `bn` | Bengali | বাংলা | 🔜 Planned |
| `mr` | Marathi | मराठी | 🔜 Planned |
| `gu` | Gujarati | ગુજરાતી | 🔜 Planned |
| `kn` | Kannada | ಕನ್ನಡ | 🔜 Planned |
| `ml` | Malayalam | മലയാളം | 🔜 Planned |
| `or` | Odia | ଓଡ଼ିଆ | 🔜 Planned |
| `pa` | Punjabi | ਪੰਜਾਬੀ | 🔜 Planned |
| `ur` | Urdu | اردو | 🔜 Planned |

## 📖 Prayer Topics

1. **Daily Prayers** - Morning, evening, mealtime
2. **Healing & Health** - Physical, emotional, mental
3. **Protection & Safety** - Personal, spiritual, financial
4. **Anxiety & Peace** - Worry, fear, sleep
5. **Relationships** - Marriage, parenting, friendship
6. **Guidance & Wisdom** - Decisions, discernment, purpose
7. **Spiritual Growth** - Faith, Holy Spirit, repentance
8. **Gratitude & Worship** - Thanksgiving, praise
9. **Intercession** - Nation, persecuted church, missions, salvation
10. **Seasonal** - Advent, Lent, Easter, Pentecost, New Year

## 🔧 Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

## 🌍 Deployment

### Netlify (Recommended)

1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variables in Netlify dashboard

### Vercel

```bash
npm i -g vercel
vercel deploy
```

### Cloudflare Pages

1. Connect repository in Cloudflare Pages
2. Build command: `npm run build`
3. Output directory: `dist`

## 📱 PWA Features

- **Offline Support** - Service worker caches all assets
- **Install Prompt** - Add to home screen on mobile
- **Push Notifications** - Daily verse reminders (VAPID keys needed)
- **Background Sync** - Favorites sync when online

## ♿ Accessibility

- Semantic HTML5
- ARIA labels and roles
- Focus management
- Keyboard navigation
- Screen reader optimized
- High contrast support
- Reduced motion support
- Scalable text (up to 200%)

## 🧪 Testing

```bash
# Run tests (when implemented)
npm run test

# E2E tests
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- **ESV API** by Crossway for Bible text
- **API.Bible** by Faithlife for translations and audio
- **FCBH** for audio recordings
- **ipapi.co** for geo-location
- **Noto Fonts** for Indic language support
- **Lucide** for beautiful icons

## 📞 Support

- **Email**: hello@bibledaily.app
- **Issues**: [GitHub Issues](https://github.com/yourusername/bible-daily/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/bible-daily/discussions)

---

Made with faith ❤️ for the global Church