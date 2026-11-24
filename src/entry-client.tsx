/**
 * Client Entry Point for React Hydration
 * Initializes i18n and renders React islands
 */

import { hydrate } from 'react-dom/client';
import { initI18n } from '@/lib/i18n';
import { AppProvider } from '@/context/AppContext';

// Initialize i18n before hydrating
initI18n().then(() => {
  // Find all island roots
  const islands = document.querySelectorAll('[data-island]');
  
  islands.forEach((island) => {
    const componentName = island.getAttribute('data-island');
    const props = JSON.parse(island.getAttribute('data-props') || '{}');
    
    // Dynamic import for code splitting
    import(`@/components/islands/${componentName}.tsx`)
      .then((module) => {
        const Component = module.default;
        const root = hydrate(
          <AppProvider>
            <Component {...props} />
          </AppProvider>,
          island
        );
      })
      .catch((err) => {
        console.error(`Failed to hydrate island ${componentName}:`, err);
      });
  });
});

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled rejection:', event.reason);
});