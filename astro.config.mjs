import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://bible-daily.example.com',
  output: 'static',
  adapter: undefined,
  integrations: [
    react({
      include: ['**/*.tsx', '**/*.jsx'],
    }),
    tailwind({
      applyBaseStyles: true,
      nesting: true,
    }),
  ],
  vite: {
    build: {
      minify: 'esbuild',
      cssMinify: true,
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'i18next', 'react-i18next'],
    },
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
  experimental: {
    contentLayer: true,
  },
});