import { defineRouting } from 'next-intl/routing';

/**
 * Locale routing (SRS FR-26.3): Serbian (Latin) is the default, English is
 * secondary. Both locales are prefixed (`/sr/...`, `/en/...`); the root `/`
 * redirects to the default locale via middleware.
 */
export const routing = defineRouting({
  locales: ['sr', 'en'],
  defaultLocale: 'sr',
  localePrefix: 'always',
  // New visitors default to Serbian regardless of browser Accept-Language
  // (SRS C-1). English is opt-in via the switcher; the choice is persisted in
  // the NEXT_LOCALE cookie (DB sync for logged-in users in M3 / #13).
  localeDetection: false,
  // Persist the chosen locale (also reconciled with the DB for logged-in
  // users in M3 / #13).
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 60 * 60 * 24 * 365,
  },
});

export type Locale = (typeof routing.locales)[number];
