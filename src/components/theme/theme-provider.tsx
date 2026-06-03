'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { DEFAULT_THEME, THEMES } from '@/lib/theme';

/**
 * App theme provider. Dark-first: the OS preference is intentionally NOT followed
 * (enableSystem=false) so the default is always the dark "tavern at night" theme
 * until the user explicitly toggles (SRS FR-23.1). next-themes injects a
 * pre-paint script, so there is no flash of the wrong theme.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="data-theme"
      defaultTheme={DEFAULT_THEME}
      themes={[...THEMES]}
      enableSystem={false}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
