/** Available color themes. Dark is the default ("tavern at night"). */
export const THEMES = ['dark', 'light'] as const;
export type Theme = (typeof THEMES)[number];

export const DEFAULT_THEME: Theme = 'dark';

/** Pure helper: the theme to switch to from the current one. */
export function getNextTheme(current: string | undefined | null): Theme {
  return current === 'light' ? 'dark' : 'light';
}
